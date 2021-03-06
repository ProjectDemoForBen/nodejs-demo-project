import React, {Component} from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';
import config from "../../../config";

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    imageUrl: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
        query: `
            query FetchPost($id: ID!){
                getPost(id: $id){
                    id
                    title
                    content
                    imageUrl
                    createdAt
                    creator {
                        name
                    }
                }
            }
        `,
        variables: {
            id: postId
        }
    }
    fetch(`${config.backend}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.token}`
        },
        body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch status');
        }
        console.log(resData)
        this.setState({
          title: resData.data.getPost.title,
          author: resData.data.getPost.creator.name,
          date: new Date(resData.data.getPost.createdAt).toLocaleDateString('en-US'),
          content: resData.data.getPost.content,
          imageUrl: resData.data.getPost.imageUrl,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.imageUrl}/>
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;

