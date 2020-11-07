<template>
  <div class="app">
    <div v-if="initialLoading">Loading...</div>
    <div v-else>
      <p v-if="isLoggedIn">User is logged in!!</p>
      <button v-else @click="signInWithGoogle">Sign in with Google</button>
    </div>
    <div>
      <button v-if="isLoggedIn" @click="signOut">Log Out</button>
    </div>
    <ul v-if="isLoggedIn">
      <h2>Registered Movie List</h2>
      <li v-for="(movie, i) in movies" :key="i">
        {{ movie.original_title }}
      </li>
    </ul>
    <div v-if="isLoggedIn" class="form">
      <form >
        <label>
          <span style="margin-right: 16px;">Movie Title</span>
          <input type="text" v-model="query">
        </label>
        <div>
          <p>Results</p>
          <ul>
            <li v-for="(result, i) in results" :key="i">
              <div class="reusult">
                <div class="title">{{ result.original_title }}</div>
                <img class="poster" :src="'https://image.tmdb.org/t/p/w400' + result.poster_path" alt="">
              </div>
            </li>
          </ul>
        </div>
        <!-- <div>
          <button type="submit">Register</button>
        </div> -->
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import firebase, { firestore } from 'firebase'
import { defineComponent } from 'vue'
import { AuthStore, fetchCount, auth, db } from './main'
const API_KEY = 'b006bdba5ec6e27f69db63250d5cede8'
const SEARH_PATH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`
export default defineComponent({
  computed: {
    isLoggedIn(): boolean {
      return !!AuthStore.value.currentUser
    },
    initialLoading(): boolean {
      return fetchCount.value < 1
    },
    currentUser(): firebase.User | null {
      return auth.currentUser
    }
  },
  data(): any {
    return {
      movies: [],
      query: '',
      results: [],
      isFetchingMovie: false
    }
  },
  watch: {
    async isLoggedIn(val) {
      if (val === true) {
        await this.getMyMovies()
      }
    },
    async query(val) {
      if (!val) return
      if (this.isFetchingMovie) return
      await this.searchMovie()
    }
  },
  methods: {
    async signInWithGoogle() {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const provider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(provider)
    },
    async signOut() {
      await auth.signOut()
    },
    async getMyMovies() {
      const currentUser = this.currentUser
      if (!currentUser) return
      const uid = currentUser.uid
      const doc = await db.collection('userMovies').doc(uid).get()
      const data = doc.data() as { registered: number[] } // { registered: [550, 560] }
      const movies = await Promise.all(data.registered.map(async (movieID) => {
        const doc = await db.collection('movies').doc(String(movieID)).get()
        return doc.data()
      }))
      this.movies = movies
    },
    async searchMovie() {
      this.isFetchingMovie = true
      const query = this.query
      if (!query) return
      const URL = `${SEARH_PATH}"${query}"`
      console.log('Calling API')
      console.log(URL)
      const res = await fetch(URL)
      const json = await res.json()
      console.log(json)
      this.results = json.results
      this.isFetchingMovie = false
      if (query !== this.query) {
        await this.searchMovie()
      }
    }
  }
})
</script>

<style scoped>
.form {
  margin-top: 40px;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>