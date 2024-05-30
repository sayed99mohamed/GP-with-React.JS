import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlockList.css";
import MutualFriends from "../MutualFriends/MutualFriends";
import { Link } from "react-router-dom";
import NotFound from "../NotFound/NotFound";

const BlockList = ({}) => {
  const token = localStorage?.getItem("userToken");
  const textToShow = "Your Block List Is Empty";
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const getBlockList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7134/api/friend/GetAllblock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(response.data);
      // console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getBlockList();
  }, []);

  const handleUnblockUser = async (userId) => {
    try {
      await axios.delete(
        `https://localhost:7134/api/friend/unblock/id:string ?yourid=${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container profile-page mt-2">
        <div className="row">
          {requests.length < 1 ? (
            <div
              className="bg-white p-3 text-danger d-flex mt-2  justify-content-center text-center"
              style={{ borderRadius: 12 }}
            >
              {" "}
              <NotFound textToShow={textToShow} />
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="col-xl-5 col-lg-7 col-md-12">
                <div className="card profile-header">
                  <div className="body">
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="profile-image float-md-right">
                          {" "}
                          <img
                            src={`/imgs/${request.userimage}`}
                            className="img-circle avatar"
                            style={{ width: "50px", height: "50px" }}
                            alt="Avatar"
                          />{" "}
                        </div>
                      </div>
                      <div className="col-lg-8 col-md-8 col-12">
                        <h4 className="m-t-0 m-b-0">
                          <Link to={`/AnotherProfile/${request.udi}`}>
                            {" "}
                            {request.fname} {request.lname}
                          </Link>
                          <strong></strong>
                        </h4>
                        <span className="job_post">@{request.username}</span>
                        <span
                          type="button"
                          className="d-block mutualBtn"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                        >
                          {" "}
                          {request.mutualFriends} {""}
                          Mutual Friends
                        </span>
                        <div>
                          {/* <button
                            className="btn btn-success btn-round followBtn"
                            onClick={() => handleAcceptRequest(request.udi)}
                          >
                            Accept
                          </button> */}
                          <button
                            className="btn btn-danger btn-round btn-simple"
                            onClick={() => handleUnblockUser(request.udi)}
                          >
                            UnBlock
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <MutualFriends id={request.udi} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
export default BlockList;
