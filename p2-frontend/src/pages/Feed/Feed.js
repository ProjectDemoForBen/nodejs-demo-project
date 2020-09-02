import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import config from "../../config";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

  componentDidMount() {
    fetch(`${config.backend}/users/${this.props.userId}/status`, {
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      },
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();


  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    const graphqlQuery = {
      query: `
        {
          getPosts(page: ${page}){
            posts {
              id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalItems
          }
        }
      `
    };


    fetch(`${config.backend}/graphql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch posts.');
        }
        console.log(resData);
        this.setState({
          posts: resData.data.getPosts.posts,
          totalPosts: resData.data.getPosts.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    fetch(`${config.backend}/users/${this.props.userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: this.state.status,
      }),
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p.id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('image', postData.image);

    if(this.state.editPost){
      formData.append('oldPath', this.state.editPost.imageUrl);
    }

    fetch(`${config.backend}/image`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
      },
    }).then(res => {
      return res.json();
    }).then(resData => {

      const imageUrl = resData.imageUrl || this.state.editPost.imageUrl;
      let graphqlQuery = {
        query: `
          mutation {
            createPost(postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl:"${imageUrl}"}){
              id
              title
              content
              creator {
                name
              }
              createdAt
              imageUrl
            }
          }
        `
      }

      if(this.state.editPost){
        graphqlQuery = {
          query: `
            mutation {
              updatePost(
              id: ${this.state.editPost.id}, 
              postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl:"${imageUrl}"}){
                id
                title
                content
                creator {
                  name
                }
                createdAt
                imageUrl
              }
            }
          `
        }
      }

      return fetch(`${config.backend}/graphql`, {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Authorization': `Bearer ${this.props.token}`,
          'Content-Type': 'application/json',
        },
      })

    }).then(res => {
        return res.json();
      })
      .then(resData => {

        if(resData.errors){
          throw new Error('Creating or editing a post failed!');
        }

        const post = {...(resData.data.createPost || resData.data.updatePost)};

        console.log(post);

        this.setState(prevState => {
          let totalPosts = prevState.totalPosts;

          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const index = prevState.posts.findIndex(p => p.id === prevState.editPost.id);
            updatedPosts[index] = post;
          } else {
              if (prevState.posts.length === 2) {
                  updatedPosts.pop();
              }
              updatedPosts = [post, ...updatedPosts];

              totalPosts += 1;
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: totalPosts,
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });

    const graphqlQuery = {
      query: `
        mutation {
          deletePost(id: ${postId})
        }
      `
    }

    fetch(`${config.backend}/graphql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        if (resData.errors) {
          throw new Error('Deleting a post failed!');
        }

        this.loadPosts();
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post.id}
                  id={post.id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post.id)}
                  onDelete={this.deletePostHandler.bind(this, post.id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
