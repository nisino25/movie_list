<template>
  <div>
      
    <strong v-if="isLoggedIn">Welcome {{currentUser.displayName}}!  </strong>
    <div v-if="isLoggedIn">
      <strong v-if="favMovieCount === 0 && !CountedAlredy " >
        <strong >{{getFavorite()}}</strong>
      </strong>
      <strong v-if="favMovieCount !== 0" >You have {{favMovieCount}} movies on your lists </strong><br>
    </div>

    <img v-if="isLoggedIn" :src="currentUser.photoURL" alt=""  ><br>
    <span>Search movies</span>&nbsp;  &nbsp;  
    <button v-if="!isLoggedIn" @click="signInWithGoogle">Login or sign up </button>
    <button v-else @click="signOut">Log out</button><br>
    <button @click="showFavLists(1)"  v-if="isLoggedIn">My lists</button>
    <div v-if="isLoggedIn && favLists !== '' && favMovieCount !==0">
      <strong >{{favMovieCount}}: {{updatedMovieLists}}</strong>
    </div>
  
    <br><br>
  </div>
  <div>
    <form  @submit.prevent="searchMovie" >
      <input type="number" placeholder="Type to find a movie " v-model="MovieNum">&nbsp;
      <button >ID Search</button>
      <br><br>
    </form>
    <!-- <input type="text" placeholder="Type to find a movie " v-model="CollectionNum">&nbsp;
    <button @click="collectionSearch" >Search</button> -->
    <input type="text" placeholder="Type to find a movie " v-model="movieString">&nbsp;
    <button @click="movieStringSearch" >Key word Search</button>
    <br><br>


    <input type="number" placeholder="Year " v-model="movieYear">&nbsp;
    <button @click="movieYearSearch(1)" >Popular movies from the year</button>
    <br><br>

    <div v-on:change="onChangeList">
        <select v-model="selectedDecades"> 
          <option value="1971">1971-1980</option>
          <option value="1981">1981-1990</option>
          <option value="1991">1991-2000</option>
          <option value="2001">2001-2010</option>
          <option value="2011">2011-2020</option>
          <option value="0">Best from decades</option>
        </select>
    </div>
    <br>


     <button @click="combineTest">Test </button>&nbsp;&nbsp;
    <button @click="GoodRating">Good rating only </button>&nbsp;&nbsp;
    <button @click="popMovie">Popular movie only </button>&nbsp;&nbsp;
    <!-- <button @click="GoodRating">Good rating only </button>&nbsp;&nbsp; -->
    <button @click="RandomSearch">Random search</button><br><br>
    <button @click="CensoredSearch('All')">No adult search</button>&nbsp;&nbsp;
    <button @click="CensoredSearch('18+')">Adult search</button><br><br>
    <div class="reusult">
      <div class="title" v-if="count > 0">Going through {{ count }} movies</div>
    </div>
    
    <div class="reusult" v-if="!(paginationNeeded)|| (paginationNeeded && movieHit !==0 )">
    <!-- <div class="reusult" v-if="!(paginationNeeded)"> -->
      <div class="title" v-if="movieHit > 0">Showing {{ movieHit }} movies</div>
    </div> 

    <!-- pagination -->
    <div v-if="paginationNeeded && movieHit ===0" >
      <button class="pagenation" v-for="index in 10" :key="index"  @click="movieYearSearch(index)">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
      </button>&nbsp;
    </div>
    <div v-if="paginationNeeded && movieHit !==0" >
      <button class="pagenation" v-for="index in roundUpPAge" :key="index"  @click="showFavLists(index)">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
      </button>&nbsp;
    </div>

    <div v-if="this.multipleMovies === false">

      <hr v-if="condition === 'randomSuccess' || count > 0">
      
      <div v-if="!(results.poster_path === '')">
        <div v-if="condition !== 'error'">  
          <!-- <li v-for="(result, i) in results" :key="i"> -->
          <ul >
            <li > 
              <div class="reusult">
                <strong>{{ results.original_title }} </strong><strong class="minutes" v-if="results.runtime > 0 "> ({{results.runtime}} minutes)</strong><br><br>
                <div v-if="results.adult">
                  <a v-bind:href="'https://www.themoviedb.org/search?query=' + results.original_title" target="_blank">Check this movie at TMDB</a>&nbsp;&nbsp;
                </div>
                
                <div v-else>
                  <a v-bind:href="'https://www.themoviedb.org/movie/' + results.id" target="_blank">Check this movie at TMDB</a>&nbsp;&nbsp;
                </div>
                <a v-bind:href="'https://www.google.com/search?q=movie '+ results.original_title" target="_blank">Check this on Google<br><br></a>
              </div>
            </li>
            <li>
                  <button v-if="isLoggedIn && !(!!this.favLists[results.id])" @click="toggleFavorite(results.id)" >Add to Favorite <br></button>
                  <button v-if="isLoggedIn && (!!this.favLists[results.id])" @click="toggleFavorite(results.id)" >Remove from  Favorite<br></button> 
            </li>
            <li >
              <div class="reusult">
                <div class="title" v-if="results.vote_average !== 0">Rating: {{ results.vote_average }}</div>
                <div class="title" v-else>No data </div>
              </div>
            </li>
            <li>
              <div class="reusult">
                <div class="title" v-if="results.popularity !== null || results.popularity === 0">Popularity: {{ results.popularity }}</div>
              </div>
            </li>
            <li>
              <div class="reusult">
                <div class="title">{{ results.release_date }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="isFetchingMovie === true">
          <div v-if="!isImageLoaded">
            <div v-if="!(results.poster_path === null)">
              <img src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""  >
            </div>
          </div>
        </div>
        <div v-else>
          <img class="poster" :src="'https://image.tmdb.org/t/p/w300' + results.poster_path" alt="" v-if="results.poster_path !== null"  @load="isImageLoaded = true">
        </div>

        
      </div>
      
      <div  v-if="results.poster_path === null">
        <div v-if="condition !== 'searching'">
          <img src="data:image/png;base64,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">
        </div>
      </div>
      <div class="overview" v-if="results.overview !== ''">
          <strong id="overview">{{results.overview}}</strong>
      </div>
      <div class="overview" v-else>
        <div v-if="condition === 'randomSuccess'">
          <strong id="overview">No reviews yet</strong>
        </div>
      </div>
      <!-- <hr v-if="condition === 'randomSuccess'"> -->
      <div v-if="condition === 'error'">
        <div v-if="condition !== 'searching'">
          <strong class="overview" >No movie with the id</strong>
        </div>
      </div>
    </div>


    <div v-else>
      <div v-for="(result, i) in results" :key="i">
        
        <div v-if="(i >= 20 && multipleYears) || !multipleYears ">
        
          <hr v-if="condition === 'randomSuccess'">
          
          <div v-if="!(results.poster_path === '')">
            <div v-if="condition !== 'error'">  
              <!-- <li v-for="(result, i) in results" :key="i"> -->
                
              <ul >
                <li > 
                  <div class="reusult">
                    <strong v-if="!(multipleYears)" class="minutes">{{i + 1}}  </strong>&nbsp; &nbsp;<strong v-if="!(multipleYears)">  {{ result.original_title }} <br></strong>
                    <strong v-if="multipleYears && !decades" class="minutes">{{i-19}}  </strong>&nbsp; &nbsp;<strong v-if="multipleYears && !decades"> {{ result.original_title }} <br></strong>
                    <strong v-if="multipleYears && decades && (i-19) %  10 !==0 " class="minutes">{{result.release_date.substring(0,4)}}: NO.{{(i-19) %  10}}  </strong><br> &nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 !==0 " >  {{ result.original_title }} <br></strong>
                    <strong v-if="multipleYears && decades && (i-19) %  10 ===0" class="minutes">{{result.release_date.substring(0,4)}}: NO.{{10}}  </strong> <br>&nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 ===0" >  {{ result.original_title }} <br></strong>
                  </div>
                </li>
                <li>
                    <div v-if="result.adult">
                      <a v-bind:href="'https://www.themoviedb.org/search?query=' + result.original_title" target="_blank">TMDB</a>&nbsp;&nbsp;
                      <a v-bind:href="'https://www.google.com/search?q=movie '+ result.original_title" target="_blank">Check this on Google<br><br></a>
                    </div>
                    <div v-else>
                      <a v-bind:href="'https://www.themoviedb.org/movie/' + result.id" target="_blank">TMDB</a>&nbsp;&nbsp;
                      <a v-bind:href="'https://www.google.com/search?q=movie '+ result.original_title" target="_blank">Google<br><br></a>
                    </div>
                </li>
                <li>
                  <button v-if="isLoggedIn && !(!!this.favLists[result.id])" @click="toggleFavorite(result.id)" >Add to Favorite <br></button>
                  <button v-if="isLoggedIn && (!!this.favLists[result.id])" @click="toggleFavorite(result.id)" >Remove from  Favorite<br></button> 
                </li>
                <li >
                  <div class="reusult">
                    <div class="title" v-if="result.vote_average !== 0">Rating: {{ result.vote_average }}</div>
                    <div class="title" v-else>No data </div>
                  </div>
                </li>
                <li>
                  <div class="reusult">
                    <div class="title" v-if="result.popularity !== null || result.popularity === 0">Popularity: {{ result.popularity }}</div>
                  </div>
                </li>
                <li>
                  <div class="reusult">
                    <div class="title">{{ result.release_date }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="isFetchingMovie === true">
              <div v-if="!isImageLoaded">
                <div v-if="!(result.poster_path === null)">
                  <img src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""  >
                </div>
              </div>
            </div>
            <div v-else>
              <img class="poster" :src="'https://image.tmdb.org/t/p/w300' + result.poster_path" alt="" v-if="result.poster_path !== null"  @load="isImageLoaded = true">
            </div>

            
          </div>
          
          <div  v-if="result.poster_path === null">
            <div v-if="condition !== 'searching'">
              <img src="data:image/png;base64,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">
            </div>
          </div>
          <div class="overview" v-if="result.overview !== ''">
              <strong id="overview">{{result.overview}}</strong>
          </div>
          <div class="overview" v-else>
            <div v-if="condition === 'randomSuccess'">
              <strong id="overview">No reviews yet</strong>
            </div>
          </div>
        </div>
          <!-- <hr v-if="condition === 'randomSuccess'"> -->
        
      </div>

      <div v-if="movieHit === 0">
            <strong class="overview">No movie with the keyword</strong>
        </div>
    </div>
    <!-- pagination -->
    <div v-if="paginationNeeded && movieHit ===0" >
      <button class="pagenation" v-for="index in 10" :key="index"  @click="movieYearSearch(index)">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
      </button>&nbsp;
    </div>
    <div v-if="paginationNeeded && movieHit !==0" >
      <button class="pagenation" v-for="index in roundUpPAge" :key="index"  @click="showFavLists(index)">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
      </button>&nbsp;
    </div>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import firebase from 'firebase'
import { auth, AuthStore, db } from './main2.js'

var foundAudio = new Audio('/audio/118655__pyzaist__yay.wav')

export default defineComponent( {
  computed: {
    imgLoadingStatus() {
      if (this.isImageLoaded) {
        return "Loaded";
      } else {
        return "Loading";
      }
    },
    isLoggedIn() {
      return !!AuthStore.value.currentUser
    },
    currentUser() {
      return AuthStore.value.currentUser
    }
  },
  data() {
    return{
      isFetchingMovie: false,
      firstPart: `https://api.themoviedb.org/3/movie/`,
      secondePart: `?api_key=3019330967bc149f12628b6c43bd5a32`,
      latest: '',
      MovieNum: '',
      CollectionNum: '',
      query: '',
      condition: 'waiting',

      results: {
        original_title: '',
        poster_path: ``,
        release_date: '',
        popularity: '',
        vote_average: '',
        overview: '',
        runtime: '',
        results: '',
      },

      tmdbLink: 'https://www.themoviedb.org/movie/',
      count: 0,
      generatingCount: 0,
      search18: false,
      
      movieString: null,
      movieHit: 0,
      testResult: {},
      multipleMovies: false,

      movieYear: '',
      paginationNeeded: false,
      showingPage: 1,

      multipleYears: false,


      favoriteData: {},
      updatedMovieLists: [],
      favLists: '',
      favMovieCount: 0,
      CountedAlredy: false,
      countCount: 0,
      pageForMyLists: false,
      MyListPage: 1,
      selectedDecades: 0,
      decades: false,

    }

   },
  methods: {
  async onChangeList(){
    if(this.selectedDecades === 0){
      return
    }

    
    this.decades = true;
    this.pageForMyLists = false;
    this.multipleYears = true;
    this.showingPage = 1
    this.paginationNeeded = true
    this.multipleMovies = true
    this.movieHit = 0;
    this.count =0;
    this.isImageLoaded = false;
    this.condition = 'searching';
    this.isFetchingMovie = true;
    let specificYear = this.selectedDecades;
    // const query = this.query
    let URL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1&primary_release_year=${specificYear}`
    const res = await fetch(URL)
    const json = await res.json()
    this.results = json.results

    
    let MaxYear = parseInt(specificYear) + 10

    while(specificYear < MaxYear){
      const res = await fetch(URL)
      const json = await res.json()
      let jsonCount = 0;
      while (jsonCount < 10){
        this.results =  this.results.concat(json.results[jsonCount])
        jsonCount++;
      }
      specificYear++;
      URL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1&primary_release_year=${specificYear}`;

    }

    this.isFetchingMovie = false

    // console.log(this.results)
    this.condition = 'randomSuccess'
  },
  async idCheck(movieId){
    console.log(this.favLists)
    console.log(`Checking:${movieId}`)
    // if(!!this.updatedMovieLists[id]){
    //   console.log('yes')
    // }else{
    //   console.log('no')
    // }
    console.log(!!this.favLists[movieId])
  },
  async getFavorite() {
    this.decades = false
    this.CountedAlredy = true;
    var docRef = 
    db.collection("userFavorites").doc(this.currentUser.uid)
    this.favMovieCount = 0;
    docRef.get().then((doc) => {
        if (doc.exists) {
          this.favLists = doc.data()
          // console.log(doc.data())


          this.updatedMovieLists = []
          let i = 0;
          
          // console.log(this.favLists)
          for (i in this.favLists){
            if(this.favLists[i]) {
              this.updatedMovieLists[this.favMovieCount] = i
              this.favMovieCount ++;
              // console.log(this.updatedMovieLists[this.favMovieCount - 1])
            } 
          }
          this.roundUpPAge = Math.ceil(this.updatedMovieLists.length /20)
        } else {
          console.log("No such document!");
        }

    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  },
  async showFavLists(page){
    if(this.favMovieCount === 0)
      return;
    
    this.decades = false;
    this.pageForMyLists = true;
    this.multipleYears = false;
    this.showingPage = page
    this.paginationNeeded = true
    this.multipleMovies = true
    this.movieHit = 0;
    this.count =0
    this.isImageLoaded = false
    this.condition = 'searching'
    this.isFetchingMovie = true
    const query = this.query
    this.countCount = 0;
    let fakeLists = [];
    let maxForPage = 0;

    this.countCount = page*20 -20
    const res = await fetch(`${this.firstPart}${this.updatedMovieLists[page*20 -20]}${this.secondePart}`)
    const json = await res.json()
    fakeLists = fakeLists.concat(json)
    this.countCount ++

    if(page* 20 >= this.favMovieCount){
      maxForPage = this.favMovieCount
    }else{
      maxForPage = page*20
    }
    console.log(`counconut: ${this.countCount}`)
    console.log(`macforpage:${maxForPage}`)

    while(this.countCount < maxForPage){
      const res = await fetch(`${this.firstPart}${this.updatedMovieLists[this.countCount]}${this.secondePart}`)
      const json = await res.json()
      fakeLists = fakeLists.concat(json)
      this.countCount ++
      console.log('hey2')
    }
    



    // const res = await fetch(`${this.firstPart}${this.updatedMovieLists[this.countCount]}${this.secondePart}`)
    // const json = await res.json()
    // fakeLists = fakeLists.concat(json)
    // this.countCount ++

    // while(this.countCount < this.favMovieCount){
    //   const res = await fetch(`${this.firstPart}${this.updatedMovieLists[this.countCount]}${this.secondePart}`)
    //   const json = await res.json()
    //   fakeLists = fakeLists.concat(json)
    //   this.countCount ++
    // }

    this.isFetchingMovie = false
    this.condition = 'randomSuccess'
    if (query !== this.query) {
      await this.searchMovie()
    }

    

    this.results= fakeLists
    this.movieHit = this.results.length
    // console.log(`Thing u need: ${this.movieHit}`)
    let countFor = 0
    while( countFor < this.favMovieCount){
      // console.log(this.results[countFor].original_title)
      countFor++;
    }
    // for (result, i in this.results){
    //   console.log(this.results[i])
    // }
    console.log(this.movieHit)
  },
  async signInWithGoogle() {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
    
  },
  async signOut() {
    await auth.signOut()
  },
  async toggleFavorite(movieId) {
    console.log('trying..')
    if (!this.currentUser) return

    const docRef = db.collection('userFavorites').doc(this.currentUser.uid)
    const val = await docRef.get()

    const favoriteData = val.exists ? val.data() : {}

    /**
     * 既にtrueだったら -> falseに変わる
     * 既にfalseふぁったら -> trueに変わる
     * まだない(undefined)だったら -> trueに変わる
     */
    favoriteData[movieId] = !favoriteData[movieId]

    await docRef.set(favoriteData)

    //temorary
    // this.favoriteData = favoriteData

    /**
     * userFavorites
     *    ┗ userId1
     *        ┗ {
     *             movieId1: true
     *             movieId2: false
     *          }
     *    ┗ userId2
     * 
     */
    console.log('success')
    this.getFavorite()
  },
  async getLatestNum(contentType){
    // https://api.themoviedb.org/3/movie/latest?api_key=3019330967bc149f12628b6c43bd5a32
    // https://api.themoviedb.org/3/tv/latest?api_key=3019330967bc149f12628b6c43bd5a32
      if(contentType === 'tv'){
        const res = await fetch('https://api.themoviedb.org/3/tv/latest?api_key=3019330967bc149f12628b6c43bd5a32')
        const json = await res.json()
        this.latest = json.id
        this.firstPart = `https://api.themoviedb.org/3/tv/`
      }else{
        const res = await fetch('https://api.themoviedb.org/3/movie/latest?api_key=3019330967bc149f12628b6c43bd5a32')
        const json = await res.json()
        this.latest = json.id
        this.firstPart = `https://api.themoviedb.org/3/movie/`
      }

      console.log(`latest:${this.latest}`)
    },
  async combineTest(){
    this.decades = false;
    this.pageForMyLists = false;
    this.multipleYears = true;
    this.showingPage = 1
    this.paginationNeeded = true
    this.multipleMovies = true
    this.movieHit = 0;
    this.count =0
    this.isImageLoaded = false
    this.condition = 'searching'
    this.isFetchingMovie = true
    let specificYear = 1950
    // const query = this.query
    let URL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1&primary_release_year=${specificYear}`
    const res = await fetch(URL)
    const json = await res.json()
    console.log(`${specificYear}:`)
    console.log(json.results)
    this.results = json.results

  while(specificYear < 2020){
    const res = await fetch(URL)
    const json = await res.json()
    
    let jsonCount = 0;
    while (jsonCount < 3){
      this.results =  this.results.concat(json.results[jsonCount])
      jsonCount++;
    }

    specificYear++;
    URL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1&primary_release_year=${specificYear}`;

  }

    this.isFetchingMovie = false

    // console.log(this.results)
    this.condition = 'randomSuccess'
    console.log(this.results)
  },
  async movieYearSearch(page){
    this.decades = false;
    this.pageForMyLists = false;
    this.multipleYears = false;
    this.showingPage = page
    this.paginationNeeded = true
    this.multipleMovies = true
    this.movieHit = 0;
    this.count =0
    this.isImageLoaded = false
    this.condition = 'searching'
    this.isFetchingMovie = true
    const query = this.query
    
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=${page}&primary_release_year=${this.movieYear}`
    const res = await fetch(URL)
    const json = await res.json()
    console.log(json)
    this.results = json.results
    this.movieHit = json.results.length

    this.isFetchingMovie = false
    if(json.success === false){
      this.condition = 'error'
    }else{
      this.condition = 'randomSuccess'
    }
    if (query !== this.query) {
      await this.searchMovie()
    }
    // console.log(`movie hits:${this.movieHit}`)
    // console.log(this.results)
    // console.log(`date: ${json.results.release_date}`)
    
    for (this.testResult in json) {
      console.log(`title: ${this.testResult.original_title}`)
      
    }

    },
  async searchMovie() {
    this.decades = false;
    this.pageForMyLists = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.count =0
    this.isImageLoaded = false
    this.condition = 'searching'
    this.isFetchingMovie = true
    const query = this.query
    // const URL = `${this.firstPart}${this.MovieNum}${this.secondePart}`
    const URL = 'https://api.themoviedb.org/3/movie/500?api_key=3019330967bc149f12628b6c43bd5a32'
    console.log('Calling API')
    console.log(URL)
    const res = await fetch(`${this.firstPart}${this.MovieNum}${this.secondePart}`)
    const json = await res.json()
    console.log(json)
    this.results = json

    
    console.log(`poster path: ${this.results.poster_path}`)
    // console.log('other way is ....')
    // console.log(json)
    this.isFetchingMovie = false
    if(json.success === false){
      this.condition = 'error'
    }else{
      this.condition = 'randomSuccess'
    }
    if (query !== this.query) {
      await this.searchMovie()
    }
    
  },
  async movieStringSearch() {
    this.decades = false;
    this.pageForMyLists = false;
    this.multipleYears = false;
    this.multipleMovies = true
    this.movieHit = 0;
    this.count =0
    this.isImageLoaded = false
    this.condition = 'searching'
    this.isFetchingMovie = true
    const query = this.query
    console.log('heeeey')
    
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=3019330967bc149f12628b6c43bd5a32&query=${this.movieString } `)
    const json = await res.json()
    this.results = json.results
    this.movieHit = json.results.length

    this.isFetchingMovie = false
    if(json.success === false){
      this.condition = 'error'
    }else{
      this.condition = 'randomSuccess'
    }
    if (query !== this.query) {
      await this.searchMovie()
    }
  },
  async RandomSearch(){
    this.decades = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.isImageLoaded = false
    this.MovieNum = ''
    this.condition = 'searching'
    this.count = 0;
    this.generatingCount = 0;
    this.isFetchingMovie = true;
    

    while(this.condition !== 'randomSuccess'){
      const query = this.query

      // this.getLatestNum('movie');
      const res2 = await fetch('https://api.themoviedb.org/3/movie/latest?api_key=3019330967bc149f12628b6c43bd5a32')
      const json2 = await res2.json()
      this.latest = json2.id
      this.firstPart = `https://api.themoviedb.org/3/movie/`
      this.MovieNum = Math.random()
      this.MovieNum = Math.floor(this.MovieNum * 1000000)
      while(this.MovieNum > this.latest){
        this.MovieNum = Math.random()
        this.MovieNum = Math.floor(this.MovieNum * 1000000)
        this.generatingCount ++;
        console.log(`${this.generatingCount}: ${this.MovieNum}`)
        
        // this.count++;
      }

      const res = await fetch(`${this.firstPart}${this.MovieNum}${this.secondePart}`)
      const json = await res.json()
      console.log(json)
      this.results = json
      this.tmdbLink = this.tmdbLink + this.results.id
      this.condition = 'searching'
      if(json.success !== false){
        this.condition = 'randomSuccess'
      }else{
        this.count++;
      }
      
      if (query !== this.query) {
      await this.searchMovie()
    }
    }
    console.log(`I tried: ${this.count} times`)
    this.isFetchingMovie = false; 
  },
  async CensoredSearch(keyword){
    this.decades = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.isImageLoaded = false
    this.MovieNum = ''
    this.condition = 'searching'
    this.count = 0;
    this.isFetchingMovie = true;

    while(this.condition !== 'randomSuccess'){
      const query = this.query

      
      this.MovieNum = Math.random()
      this.MovieNum = Math.floor(this.MovieNum * 1000000)
      while(this.MovieNum > 760771){
        this.MovieNum = Math.random()
        this.MovieNum = Math.floor(this.MovieNum * 1000000)
        // this.count++;
      }

      const res = await fetch(`${this.firstPart}${this.MovieNum}${this.secondePart}`)
      const json = await res.json()
      this.results = json
      this.tmdbLink = this.tmdbLink + this.results.id
      this.condition = 'searching'
      console.log(json)
      if(json.success !== false){
        if(keyword === 'All'){
          if(!(json.adult)){
            this.condition = 'randomSuccess'
            this.isFetchingMovie = false;
          }else{
            this.count++;
            // console.log('adult but ignored it')
          }
        }else if(keyword === '18+')
          this.searh18 = true
          if(json.adult && json.poster_path !== null){
            this.condition = 'randomSuccess'
            this.isFetchingMovie = false;
          }else{
            console.log(`I  trully failed: ${this.count}`)
            this.count++
          }
      }else{
        this.count++;
      }
      
      if (query !== this.query) {
      await this.searchMovie()
    }
    }
    console.log(`I tried: ${this.count} times`)
    this.condition = 'randomSuccess'
    this.searh18 = false
  },
  async GoodRating(){
    this.decades = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.isImageLoaded = false
    this.MovieNum = ''
    this.condition = 'searching'
    this.count = 0;
    this.isFetchingMovie = true;

    while(this.condition !== 'randomSuccess'){
      const query = this.query

      console.log(`${this.count} tryies`)
      this.MovieNum = Math.random()
      this.MovieNum = Math.floor(this.MovieNum * 1000000)
      while(this.MovieNum > 760771){
        this.MovieNum = Math.random()
        this.MovieNum = Math.floor(this.MovieNum * 1000000)
        // this.count++;
      }

      const res = await fetch(`${this.firstPart}${this.MovieNum}${this.secondePart}`)
      const json = await res.json()
      console.log(json)
      this.results = json
      this.tmdbLink = 'https://www.themoviedb.org/movie/' + this.results.id

      this.condition = 'searching'
      console.log(json)
      if(this.results.success !== false){
        if(this.results.vote_average >= 8 && this.results.vote_average !== 0 && this.results.vote_average !== 10){
          this.condition = 'randomSuccess'
          this.isFetchingMovie = false;
          foundAudio.play()
        }else{
          this.count++;
        }
      }else{
        this.count++;
      }
      
      if (query !== this.query) {
      await this.searchMovie()
      }
    }
    console.log(`I tried: ${this.count} times`)
    this.condition = 'randomSuccess'
    this.searh18 = false
    console.log(`link: ${this.tmdbLink}`)
    console.log(`id: ${this.results.id}`)
  },
  async popMovie(){
    this.decades = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.isImageLoaded = false
    this.MovieNum = ''
    this.condition = 'searching'
    this.count = 0;
    this.isFetchingMovie = true;

    while(this.condition !== 'randomSuccess'){
      const query = this.query

      console.log(`${this.count} tryies`)
      this.MovieNum = Math.random()
      this.MovieNum = Math.floor(this.MovieNum * 1000000)
      while(this.MovieNum > 760771){
        this.MovieNum = Math.random()
        this.MovieNum = Math.floor(this.MovieNum * 1000000)
        // this.count++;
      }

      const res = await fetch(`${this.firstPart}${this.MovieNum}${this.secondePart}`)
      const json = await res.json()
      console.log(json)
      this.results = json

      this.tmdbLink = 'https://www.themoviedb.org/movie/' + this.results.id

      this.condition = 'searching'
      console.log(json)
      if(this.results.success !== false){
        if(this.results.popularity >= 20 && this.results.popularity!== 0){
          this.condition = 'randomSuccess'
          this.isFetchingMovie = false;
          foundAudio.play()
        }else{
          this.count++;
        }
      }else{
        this.count++;
      }
      
      if (query !== this.query) {
      await this.searchMovie()
      }
    }
    console.log(`I tried: ${this.count} times`)
    this.condition = 'randomSuccess'
    this.searh18 = false
    console.log(`condition: ${this.condition}`)
  },
  async collectionSearch(){
    this.decades = false;
    this.multipleYears = true;
    this.multipleMovies = false;
    this.isImageLoaded = false
    this.MovieNum = ''
    this.condition = 'searching'
    this.count = 0;
    this.isFetchingMovie = true;

    while(this.condition !== 'randomSuccess'){
      const query = this.query

      
      this.CollectionNum= Math.random()
      this.CollectionNum = Math.floor(this.MovieNum * 1000000)
      while(this.CollectionNum > 760771){
        this.CollectionNum = Math.random()
        this.CollectionNum = Math.floor(this.MovieNum * 1000000)
        // this.count++;
      }

      const res = await fetch(`https://api.themoviedb.org/3/collection/${this.CollectionNum}${this.secondePart}`) 
      const json = await res.json()
      console.log(json)
      this.results = json
      this.tmdbLink = this.tmdbLink + this.results.id
      this.condition = 'searching'
      if(json.success !== false){
        this.condition = 'randomSuccess'
      }else{
        this.count++;
      }
      
      if (query !== this.query) {
      await this.searchMovie()
    }
    }
    console.log(`I tried: ${this.count} times`)
    this.isFetchingMovie = false; 
    console.log(`end length: ${this.results.size} `)
    // https://api.themoviedb.org/3/collection/2?api_key=3019330967bc149f12628b6c43bd5a32
  },
  },
  watch: {
    async query(val) {
      if (!val) return
      if (this.isFetchingMovie) return
      await this.searchMovie()
    }
  },
  created(){
  },

})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.overview {
  color: red;
  /* max-width:300px; */
  margin-right: 200px;
  margin-left: 200px;
  
  
}
.minutes {
  color: grey;

}

.pagenation{
  margin: 3px;
}
.displayedPage{
  color: red;
}

li{
  margin-right: 200px;
  margin-left: 200px;
}
</style>
