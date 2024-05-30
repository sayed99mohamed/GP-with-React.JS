import React, { useState, useEffect } from "react";
import axios from "axios";
import {  Link } from "react-router-dom";
export default function Likes({ likesList }) {
  return (
    <div className="modal fade" id="showLikesOnPost" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className=" modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">All Likes</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          {likesList.length < 1 ? (
            <div className="bg-white p-1 text-danger d-flex vh-75 justify-content-center align-items-center flex-column text-center">
              <h1>Sorry,  There is no Likes </h1>
            </div>
          ) : (
            likesList.map((Person) => (
              <ul key={Person.username} class="list-group list-group-flush">
                <li class="list-group-item pt-0 mb-3">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 me-3">
                      {/* <img src={likesList.image} alt="" class="avatar rounded-circle" /> Use the image from mutualFriend */}
                      <img  src={`/imgs/${Person.imgeurl}`}
                       class="avatar rounded-circle" alt="user profile image" />

                    </div>
                    <div class="flex-grow-1">
                      <Link
                                  to={`/AnotherProfile/${Person.userid}`}
                                >
                      <h6 class="mb-0">
                        {Person.username} </h6>
                      </Link>
                    </div>
                   
                  </div>
                </li>
              </ul>
            ))

          )}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
  </div>
 );
}