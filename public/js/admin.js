const deleteProduct = (btn, csrf, prodId) => {
    const productElement = btn.closest('article');

    fetch(`/admin/delete-product/${prodId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf,
        },
    })
        .then((result) => {
            if (result.status === 200) return result.json();
            else throw new Error('error');
        })
        .then((data) => {
            console.log(data);
            productElement.parentNode.removeChild(productElement);
        })
        .catch((err) => {
            console.log(err);
        });
};
