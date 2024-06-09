const post = [
  {
    postID: 4,
    text_content: "post Arya",
    createdDatetime: "2024-06-03T18:02:54.000+00:00",
    media_type: null,
    media_file:
      "data:image/jpeg;base64,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",
    user: {
      userID: 1,
      username: "whitepanther",
    },
    memeLikes: [
      {
        memeLikePK: {
          postID: 4,
          userID: 2,
        },
        post: {
          postID: 4,
          text_content: "post Arya",
          createdDatetime: "2024-06-03T18:02:54.000+00:00",
          media_type: null,
          media_file: "uploads/posts/whitepanther/whitepanther-4.png",
        },
        user: {
          userID: 2,
          username: "noecaptures",
        },
      },
    ],
    comments: [
      {
        commentID: 1,
        text_content: "menuda gatita jeje",
        created_datetime: "2024-06-05T15:40:49.000+00:00",
        user: {
          userID: 2,
          username: "noecaptures",
        },
      },
    ],
  },
  {
    postID: 3,
    text_content: "post patri ",
    createdDatetime: "2024-06-03T18:02:43.000+00:00",
    media_type: null,
    media_file:
      "data:image/jpeg;base64,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",
    user: {
      userID: 3,
      username: "paricia",
    },
    memeLikes: [
      {
        memeLikePK: {
          postID: 3,
          userID: 1,
        },
        post: {
          postID: 3,
          text_content: "post patri",
          createdDatetime: "2024-06-03T18:02:43.000+00:00",
          media_type: null,
          media_file: "uploads/posts/paricia/paricia-3.png",
        },
        user: {
          userID: 1,
          username: "noecaptures",
        },
      },
    ],
    comments: [
      {
        commentID: 1,
        text_content: "oleeee",
        created_datetime: "2024-06-05T15:40:49.000+00:00",
        user: {
          userID: 2,
          username: "noecaptures",
        },
      },
      {
        commentID: 2,
        text_content: "guapaaaa",
        created_datetime: "2024-06-05T15:42:03.000+00:00",
        user: {
          userID: 2,
          username: "noecaptures",
        },
      },
      {
        commentID: 3,
        text_content: "reinaaaaa",
        created_datetime: "2024-06-05T15:42:53.000+00:00",
        user: {
          userID: 2,
          username: "noecaptures",
        },
      },
    ],
  },
  // {
  //   "postID": 1,
  //   "text_content": "post arya 1",
  //   "createdDatetime": "2024-06-03T18:02:19.000+00:00",
  //   "media_type": null,
  //   "media_file": "data:image/jpeg;base64,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",
  //   "user": {
  //     "userID": 1,
  //     "username": "whitepanther"
  //   },
  //   "memeLikes": [
  //     {
  //       "memeLikePK": {
  //         "postID": 1,
  //         "userID": 2
  //       },
  //       "post": {
  //         "postID": 1,
  //         "text_content": "post arya 1",
  //         "createdDatetime": "2024-06-03T18:02:19.000+00:00",
  //         "media_type": null,
  //         "media_file": "uploads/posts/whitepanther/whitepanther-1.png"
  //       },
  //       "user": {
  //         "userID": 2,
  //         "username": "noecaptures"
  //       }
  //     }
  //   ],
  //   "comments": []
  // }
];
const changeImgLiked = (post) => {
  let isLike = post.memeLikes.some((like) => like.memeLikePK.userID === 2);
  if (isLike) {
    return "../Assets/ja.png";
  } else {
    return "../Assets/jajaja.png";
  }
};
const isLiked = (post) => {
  let isLike = post.memeLikes.some((like) => like.memeLikePK.userID === 2);
  return isLike;
};
const lista = document.getElementById("listPost");
post.forEach((elemento) => {
  const postDiv = document.createElement("article");
  postDiv.classList.add("post");

  const postContent = `
      <figure>
          <img class="img-post" src="${elemento.media_file}" alt="Imagen de ${
    elemento.user.username
  }"></figure>
          <div>
              <div class="span-icons">
                  <span>
                      <img class="heart-icon" id="btnLike-${
                        elemento.postID
                      }" src="${changeImgLiked(elemento)}"/> ${
    elemento.memeLikes.length
  }
                  </span>
                  <span>
                      ${elemento.comments.length}
                      <img class="heart-icon" src="../Assets/comments-icon.svg"/>
                  </span>
              </div>
              <div class="details-section">
                  <span><strong>${elemento.user.username}</strong>: ${
    elemento.text_content
  }</span>
                  <div class="comments-section">
                      ${elemento.comments
                        .map(
                          (comentario) => `
                          <span>${comentario.user.username}: ${comentario.text_content}</span>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          </article>
      `;
  postDiv.innerHTML = postContent;
  lista.appendChild(postDiv);
});

//Lógica darle a like
post.forEach((elemento) => {
  const btnLike = document.getElementById(`btnLike-${elemento.postID}`);
  btnLike.addEventListener("click", function () {
    console.log("Like button clicked for post", elemento.postID);
    const newImgSrc = isLiked(elemento)
      ? "../Assets/jajaja.png"
      : "../Assets/ja.png";
    btnLike.classList.add("like");
    setTimeout(() => {
      btnLike.src = newImgSrc;
      btnLike.classList.remove("like");
    }, 300);
  });
});
