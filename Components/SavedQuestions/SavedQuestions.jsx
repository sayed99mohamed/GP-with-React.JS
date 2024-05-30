import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SavedQuestions({ userData }) {
  const token = localStorage.getItem("userToken");
  const bookMark = localStorage.getItem("askBookmarked");
  const [askBookmarked, setAskBookmarked] = useState(
    JSON.parse(localStorage?.getItem("askBookmarked")) || {} // Initialize as an empty object if null
  );
  const [comments, setComments] = useState([]);
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [askContent, setAskContent] = useState("");
  const [commentText, setCommentText] = useState(""); // State for storing comment text
  const [likedQuestion, setLikedQuestion] = useState({});
  const [warehouseData, setWarehouseData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

 
  async function getComments() {
    try {
      const response = await axios.get(
        "https://localhost:7134/api/Question/GetAllComment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);
      console.log(response.data);
      localStorage.setItem("comments", JSON.stringify(response.data));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // console.log('Unauthorized access');
      } else {
        // console.error('Error fetching comments:', error);
      }
    }
  }

  async function arrowUp(commentId, commentRating) {
    try {
      await axios.post(
        `https://localhost:7134/api/Question/LikeComment?id=${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateCommentRating(commentId, commentRating + 1);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  async function arrowDown(commentId, commentRating) {
    try {
      await axios.post(
        `https://localhost:7134/api/Question/DisLikeComment?id=${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateCommentRating(commentId, commentRating - 1);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  }

  function updateCommentRating(commentId, rating) {
    // Update comments in state
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, rateComment: rating };
        }
        return comment;
      });
    });

    // Update comments in local storage
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, rateComment: rating };
      }
      return comment;
    });
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  }
  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7134/api/Question/GetBookmark`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWarehouseData({
        ...warehouseData,
        results: response.data.reverse(),
        loading: false,
        err: null,
      });
    } catch (err) {
      setWarehouseData({
        ...warehouseData,
        loading: false,
        err: err.response?.data?.err || "Error fetching projects",
      });
    }
  };

  async function toggleLike(askID) {
    try {
      const isLiked = likedQuestion[askID] || false;
      if (isLiked) {
        await axios.delete(
          `https://localhost:7134/api/Question/DeleteLike/id:int ?questionid=${askID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://localhost:7134/api/Question/LikeQuestion/id:int?id=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      getQuestions();
      const updatedLikedQuestion = { ...likedQuestion, [askID]: !isLiked };
      localStorage.setItem(
        "likedQuestions",
        JSON.stringify(updatedLikedQuestion)
      );
      setLikedQuestion(updatedLikedQuestion);
    } catch (error) {
      console.error("Error toggling question like:", error);
    }
  }

  async function deleteQuestion(askID) {
    try {
      await axios.delete(
        `https://localhost:7134/api/Question/DeleteQuestion/id:int?id=${askID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAskSubmitted(true);
      getQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }

  const submitComment = async (questionId, commentSubmitted) => {
    try {
      const response = await axios.post(
        `https://localhost:7134/api/Question/comment?id=${questionId}&Comment=${commentSubmitted}`,
        { commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Comment submitted successfully:", response.data);
      setCommentText(""); // Clear comment text input after submission
      getComments();
      getQuestions();
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };
  async function toggleProjectBookmarked(askID) {
    localStorage.setItem("askBookMark", askID);
    console.log(JSON.parse(askID));
    try {
      const isBookmarked = askBookmarked[askID] || false;
      if (isBookmarked) {
        await axios.put(
          `https://localhost:7134/api/Question/unBookmark/questionid?questionid=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://localhost:7134/api/Question/Bookmark/id ?id=${askID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      // Update local storage with the new bookmarked projects
      const updatedBookmarkedAsks = {
        ...askBookmarked,
        [askID]: !isBookmarked,
      };
      localStorage.setItem(
        "bookmarkedAsks",
        JSON.stringify(updatedBookmarkedAsks)
      );
      setAskBookmarked(updatedBookmarkedAsks);
    } catch (error) {
      // console.error('Error toggling project bookmark:', error);
    }
  }
  useEffect(() => {
    getQuestions();
    getComments();
  }, []);

  return (
    <div>
      
      {warehouseData &&
        warehouseData.results &&
        warehouseData.results.map((ask, index) => (
          <div key={index} className="border border-1 rounded-3 w-75 my-3">
             {ask && (
            <div
              className="border border-2 rounded-3 p-10 my-2 position-relative"
              key={ask.id}
            >
              <Link
                to={`/QuestionDetails/${ask?.id}`}
                onClick={(e) => {
                  const clickedElement = e.target.tagName.toLowerCase();
                  const isButton = clickedElement === "button";
                  const isInput = clickedElement === "input";
                  const isUsernameLink =
                    e.target.classList.contains("username-link");

                  if (!isButton && !isInput && !isUsernameLink) {
                    // Navigate to QuestionDetails only if the clicked element is not a button, input, or username link
                    // You can handle the navigation here if needed
                  }
                }}
              >
                <div className="d-flex">
                  <h6 className="ps-1 fw-light username-link">
                    <Link to={`/AnotherProfile/${ask.userId}`}>
                      {"< "}
                      {ask.userName}
                      {" />"}
                    </Link>
                  </h6>
                </div>
                <h6 className="mt-1 font-monospace fs-5 ps-2">
                  {ask.question}
                </h6>
              </Link>
              <button
                onClick={() => toggleProjectBookmarked(ask.id)}
                className="border-0 ps-0 bg-white position-absolute top-10 start-100"
              >
                {ask.id === +localStorage.getItem("askBookMark") ? (
                  <i className="fa-solid fa-bookmark"></i>
                ) : (
                  <i className="fa-regular fa-bookmark"></i>
                )}
              </button>
              <div className="position-absolute top-0 end-0">
                <button
                  onClick={() => toggleLike(ask.id)}
                  className="btn mt-1 ms-2 "
                >
                  {likedQuestion[ask.id] ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>
                <p className="mt-0 ms-4">{ask.totalLike}</p>
              </div>
              <button
                onClick={() => deleteQuestion(ask.id)}
                className="btn position-absolute top-0 start-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="d-flex my-1">
                <input
                  type="text"
                  className="form-control w-75 border-1 border-secondary-subtle me-1 ms-2"
                  placeholder="Write a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={() => submitComment(ask.id, commentText)}
                  className="btn btn-outline-primary ms-2"
                >
                  Submit
                </button>
              </div>
              {/* Render comments */}
              {comments
                .filter((comment) => comment.questionId === ask.id)
                .map((comment, idx) => (
                  <div key={idx} className="d-flex align-items-center">
                    <div className="d-flex flex-column align-items-center  my-1">
                      <button
                        onClick={() => arrowUp(comment.id, comment.rateComment)}
                        className="mb-1 mt-1 px-2 border border-2 rounded"
                        style={{ background: "white" }}
                      >
                        <i className="fa-solid fa-caret-up"></i>
                      </button>
                      <p className="my-2">{comment.rateComment}</p>
                      <button
                        onClick={() =>
                          arrowDown(comment.id, comment.rateComment)
                        }
                        className="mb-1 mt-1 px-2 border border-2 rounded"
                        style={{ background: "white" }}
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </button>
                    </div>
                    <div>
                      <div className="d-flex flex-column pt-5 mt-1">
                        <p className="mx-2">{comment.text}</p>
                        <p className="fw-light ps-2">
                          <Link to={`/AnotherProfile/${comment.userid}`}>
                            {"< "}
                            {comment.userName}
                            {" />"}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
           </div>
               )}  </div>
              
       ))}
    </div>
  );
}
