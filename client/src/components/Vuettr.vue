<template>
  <div class="container">
    <div class="tweet-container">
      <header>
        <h1>vuettr</h1>
        <small>
          <a href="https://github.com/filipbasara">&copy; Filip Basara</a>
        </small>
      </header>

      <div id="add-tweet">
        <input
          :class="!valid ? 'invalid' : 'valid'"
          type="text"
          id="tweet-message"
          v-model="message"
          placeholder="What's happening?"
          @keyup.enter="createTweet"
        >
        <button type="submit" id="send-tweet" @keyup.enter="createTweet" @click="createTweet">Tweet</button>
      </div>

      <div class="tweet" v-for="tweet in tweets.slice().reverse()" :key="tweet._id">
        <div class="displayname">{{tweet.displayname}}</div>
        <div class="username">{{tweet.username}}</div>

        <p class="message">{{tweet.message}}</p>
        <div class="footer">
          <div class="info">
            <div class="likes" @click="likeTweet(tweet._id)">{{tweet.likes}} ❤</div>
            <div class="date">Posted on {{tweet.postDate}}</div>
          </div>
          <div class="actions">
            <button @click="likeTweet(tweet._id)" class="like-tweet">Like</button>
            <button @click="deleteTweet(tweet._id)" class="delete-tweet">Delete</button>
          </div>
        </div>
      </div>
      <transition>
        <div v-if="!valid && bannerIsVisible" id="banner">
          Tweet has to be between 5 and 140 characters long.
          <span
            class="dismiss-button"
            @click="bannerIsVisible = !bannerIsVisible"
          >Dismiss</span>
        </div>
      </transition>
      <div v-if="debug">
        <p class="error" v-if="error">ERROR: {{error}}</p>

        <pre class="debug">
          {{tweets}}</pre>
      </div>
    </div>
  </div>
</template>
 
<script>
import API_ENDPOINT from "../API.js";
import axios from "axios";

export default {
  name: "Vuettr",
  data() {
    return {
      tweets: [],
      error: "",
      message: "",
      displayname: "",
      username: "",
      debug: false,
      valid: true,
      bannerIsVisible: false
    };
  },

  methods: {
    resetForm() {
      this.message = "";
      this.displayname = "";
      this.username = "";
      this.valid = true;
      this.bannerIsVisible = false;
    },
    async getAllTweets() {
      await axios
        .get(API_ENDPOINT)
        .then(response => (this.tweets = response.data))
        .catch(error => (this.error = error));
    },
    getTweet(id) {
      return this.tweets.filter(tweet => {
        return tweet._id === id;
      });
    },
    async deleteTweet(id) {
      await axios.delete(`${API_ENDPOINT}${id}`);
      this.getAllTweets();
    },

    async likeTweet(id) {
      await axios.put(`${API_ENDPOINT}${id}`, {
        likes: this.getTweet(id)[0].likes + 1
      });
      this.getAllTweets();
    },
    async createTweet() {
      if (this.message.length >= 5 && this.message.length <= 140) {
        await this.randomUsername();
        await axios.post(API_ENDPOINT, {
          username: this.username,
          displayname: this.displayname,
          message: this.message,
          likes: 1
        });
        this.getAllTweets();
        this.resetForm();
      } else {
        this.valid = false;
        this.bannerIsVisible = true;
      }
    },
    async randomUsername() {
      await axios
        .get("https://randomuser.me/api/")
        .then(data => {
          this.displayname = `${data.data.results[0].name.first} ${
            data.data.results[0].name.last
          }`;
          this.username = `@${data.data.results[0].login.username}`;
        })
        .catch(error => this.error);
    }
  },

  mounted() {
    this.getAllTweets();
  }
};
</script>

<style scoped lang="scss">
$primary: #0082ec;
$secondary: darken($primary, 5);
$tertiary: desaturate($primary, 90);
$danger: rgb(160, 20, 20);
$white: #ffffff;
$lighterGrey: #f9f9f9;
$lightGrey: #e4e4e4;
$midGrey: #747474;
$darkGrey: #1b1b1b;
$black: #000000;

.container {
  max-width: 100%;
  background-color: $white;
  padding: 2rem;
  margin: 0 auto;
  display: flex;
  justify-content: stretch;
  align-content: flex-start;
  border-radius: 5px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  color: $darkGrey;
  & a {
    color: $primary;
    text-decoration: none;
    margin-top: 0.5rem;
    display: block;
  }
  & button {
    color: $lightGrey;
    background-color: $primary;
    border: 1px solid transparent;
    padding: 0.25rem 1.5rem;
    border-radius: 20px;
    font-size: 1rem;
    font-weight: 700;
    transition: 0.15s all ease-out;
    &:hover {
      color: white;
      transition: 0.15s all ease-in;
    }
  }
}

.tweet-container {
  width: 100%;
  & header {
    padding-bottom: 2rem;
    & h1 {
      font-size: 2.5rem;
      font-weight: 700;
    }
  }
  & #add-tweet {
    background-color: $lighterGrey;
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-evenly;
    border-radius: 5px;

    & input#tweet-message {
      border: 2px solid $lightGrey;
      padding: 0.5rem 4rem 0.5rem 0.5rem;
      width: 100%;
      margin-right: 2rem;
      &.invalid {
        border-color: #e74d4d;
        box-shadow: 0px 0px 3px 0px rgba(231, 77, 77, 0.4);
      }
    }

    & button#send-tweet {
      font-size: 1.25rem;
      &:hover {
        background-color: $secondary;
      }
    }
  }
  & .tweet {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    border: 1px solid $lighterGrey;
    margin-bottom: 2rem;
    transition: 0.15s all ease-out;
    &:hover {
      box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.05);
      transition: 0.15s all ease-in;
    }
    & .displayname {
      color: $darkGrey;
      margin-bottom: 0.25rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    & .username {
      color: $midGrey;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    & .message {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }
    & .footer {
      display: flex;
      justify-content: space-between;
      & > div {
        display: flex;
      }
      & .date {
        color: $midGrey;
      }
      & .likes {
        font-weight: 600;
        margin-right: 1rem;
        cursor: pointer;
      }
      & .actions {
        & button {
          margin-left: 1rem;
          background-color: $tertiary;
          color: $lightGrey;
          &.delete-tweet {
            background-color: $danger;
          }
        }
      }
    }
  }
}

#banner {
  position: fixed;
  bottom: 1rem;
  width: 80%;
  left: 10%;
  right: 10%;
  font-size: 1rem;
  padding: 2rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
  & .dismiss-button {
    font-weight: 600;
    cursor: pointer;
  }
}

.debug {
  background-color: rgb(236, 236, 236);
  padding: 1rem;
}
.error {
  background-color: rgb(136, 0, 0);
  padding: 1rem;
  color: white;
}
</style>
