const express = require("express");
const router = express.Router();

const Feed = require("../modals/Feed");
const Comment = require("../modals/Comment");
const auth = require("../middlewares/auth");

router.get("/:id", (req, res) => {
  Feed.findById(req.params.id)
    .populate("user")
    .populate("comments")
    .sort("-timestamp")
    .then((feed) => res.send(feed))
    .catch((err) => res.send({ message: err }));
});

router.get("", (req, res) => {
  Feed.find()
    .populate("user")
    .populate("comments")
    .sort("-timestamp")
    .then((feeds) => res.send(feeds))
    .catch((err) => res.send({ message: err }));
});

router.post("/new", auth, (req, res) => {
  let { user, body, mediaUrl, mediaType } = req.body;

  Feed.create({ user, body, mediaUrl, mediaType })
    .then((feed) => res.send(feed))
    .catch((err) => res.send({ message: err }));
});

router.put("/:id/update", auth, (req, res) => {
  let { body } = req.body;

  Feed.findById(req.params.id)
    .then((data) => {
      data.body = body;
      data
        .save()
        .then((feed) => res.send(feed))
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
});

router.delete("/:id/delete", auth, (req, res) => {
  // console.log(req.params.id);

  Feed.findById(req.params.id)
    .then((data) => {
      if (req.user.id == data.user) {
        console.log("Good to delete this feed");

        Comment.deleteMany({ feed_id: req.params.id })
          .then((comments) => console.log("comments deleted", comments))
          .catch((err) => console.log(err));

        Feed.deleteOne({ _id: req.params.id })
          .then((feed) => {
            res.send(feed);
          })
          .catch((err) => res.send({ message: err }));
      } else {
        console.log("Not Owner of feed");
      }
    })
    .catch((err) => res.send(err));
});

module.exports = router;
