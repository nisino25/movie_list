<template>
  <div>
    
    <div><!-- login info -->
      <strong v-if="isLoggedIn">Welcome {{currentUser.displayName}}!  </strong>&nbsp;
      <button v-if="!isLoggedIn" @click="signInWithGoogle">Login or sign up </button>
      <button v-else @click="signOut">Log out</button><br><br>
      <div v-if="isLoggedIn">
        <strong v-if="!CountedAlredy " >
          <strong >{{getLists()}}</strong>
        </strong>
        <strong class="movie-blue" >Movies</strong>, <strong class="tv-green"> TV Show</strong>,<strong class="total-red">total</strong><br>
        <strong>Favorties: <strong class="movie-blue">{{MFaCount}},</strong><strong class="tv-green"> {{TFaCount}},</strong><strong class="total-red"> {{MFaCount + TFaCount}}</strong>  &nbsp; 
          Watched: {{MPaCount}}, {{TPaCount}}, {{MPaCount + TPaCount}}&nbsp; 
          Later: {{MFuCount}}, {{TFuCount}}, {{MFuCount + TFuCount}} </strong>
          <!-- <br><br>
          <strong>Movie{{updatedMFaLists}}</strong> -->

        <!-- <strong >You have {{favMovieCount}} movies and {{favTvCount}} TV shows on your lists </strong><br> -->
      </div>

      <img v-if="isLoggedIn" :src="currentUser.photoURL" alt=""  ><br>
      <!-- <span>Search movies</span>&nbsp;  &nbsp;   -->
      
    </div>  
    <div v-if="isLoggedIn"><!-- menu -->
      <div><!-- menu button -->
        <button @click="changeTab('menu')"  v-if="isLoggedIn && shownTab !== 'menu'">Back to menu</button>&nbsp;
        <button @click="changeTab('searching')"  v-if="isLoggedIn">Find Movies or TV shows</button>&nbsp;

        <button @click="changeTab('favorites')"  v-if="isLoggedIn &&( MFaCount !== 0 || TFaCount !==0)">Favorite Lists</button>&nbsp;
        <button  v-if="isLoggedIn &&( MFaCount === 0 && TFaCount ===0)" class="tabSelected">Favorite Lists</button>&nbsp;

        <button @click="changeTab('past')"  v-if="isLoggedIn">Watched Lists</button>&nbsp;
        <button  v-if="isLoggedIn &&( MPaCount === 0 && TPaCount ===0)" class="tabSelected">Watched Lists</button>&nbsp;

        <button @click="changeTab('future')"  v-if="isLoggedIn">Watch Later</button>&nbsp;
        <button  v-if="isLoggedIn &&( MFuCount === 0 && TFuCount ===0)" class="tabSelected">Watch Later</button>&nbsp;
      </div>
      <hr v-if="(isLoggedIn && shownTab !== 'menu') ">


      <div v-if="shownTab === 'favorites' || shownTab === 'past' || shownTab === 'future' "><!-- for the lists-->
        <br>
        <button v-if="!showingMovie" @click="togggleShowingMovie()">Change to Movies lists</button>
        &nbsp;
        <button v-if="showingMovie" @click="togggleShowingMovie()">Change to TV lists</button>
        &nbsp;
        <button @click="toggleSimplify" v-if="!simplifyNeeded">Show Simplifed Lists</button>
        <button @click="toggleSimplify" v-else>Hide Simplifed Lists</button>
      </div>
    
      <br>
    </div>
   
  </div>



  <div>
    <div v-if="shownTab === 'searching'">
      <div><!-- button to toggle tv and movie -->
        <button v-if="!tabMovieSelected" @click="toggleTab">Change to Movies search</button>
        &nbsp;
        <button v-if="tabMovieSelected" @click="toggleTab">Change to TV search</button>
        <br>
      </div><br>

      <div> <!-- changing serch engine button -->
        <button v-if="!ShowRandom" class="tabSelected">Regular Searching now</button>
        <button v-else @click="toggleRandom">Change to regular Search</button>
        &nbsp;
        <button v-if="!ShowRandom" @click="toggleRandom">Change to Random Search</button>
        <button v-else class="tabSelected">Random Searching now</button>
      </div>

      <div v-if="!tabMovieSelected"><!-- tv saearch -->
        <strong>You are searching TV shows now</strong> <br><br>
        <div v-if="!ShowRandom"><!-- regular searhch -->
          <div> <!-- genre-->
            <select v-model="chosenGenre"> 
              <option value="10759">Action</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="18">Drama</option>
              <option value="9648">Mystery</option>
              <option value="10765">Sci-Fo</option>
              <option value="0">All Genres</option>
            </select> &nbsp;
            <select v-model="excludeGenre"> 
              <option value="10759">No Action</option>
              <option value="16">No Animation</option>
              <option value="35">No Comedy</option>
              <option value="18">No Drama</option>
              <option value="9648">No Mystery</option>
              <option value="10765">No Sci-Fo</option>
              <option value="0"></option>
            </select> &nbsp;
            <select v-model="originalLanguage"> 
              <option value="ja">Japanese</option>
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="0">All languages</option>
            </select> &nbsp;

            <button @click="resetChoices">Reset </button>
            
          </div><br>
          <input type="text" placeholder="Type to find a TV Show " v-model="movieString">&nbsp;
          <button @click="StringSearch('tv')" >Key word Search for TV shows</button><br><br>

          
          <input type="number" placeholder="Year " v-model="contentYear">&nbsp;
          <button @click="contentYearSearch(1)" >Popular TV Shows from the year</button><br><br>

          <div v-on:change="decadeSearch">
              <select v-model="selectedDecades"> 
                <option value="1971">1971-1980</option>
                <option value="1981">1981-1990</option>
                <option value="1991">1991-2000</option>
                <option value="2001">2001-2010</option>
                <option value="2011">2011-2020</option>
                <option value="0">Best from decades</option>
              </select>
          </div><br>
        </div>
      </div>

      <div velse v-if="tabMovieSelected" > <!-- movie saearch -->
        <strong>You are searching Movies now</strong> <br><br>
        <div v-if="!ShowRandom">
          <div> <!--Choseing preference -->
            <select v-model="chosenGenre"> 
              <option value="28">Action</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="18">Drama</option>
              <option value="9648">Mystery</option>
              <option value="878">Sci-Fi</option>
              <option value="0">All Genres</option>
            </select> &nbsp;
            <select v-model="excludeGenre"> 
              <option value="28">No Action</option>
              <option value="16">No Animation</option>
              <option value="35">No Comedy</option>
              <option value="18">No Drama</option>
              <option value="9648">No Mystery</option>
              <option value="878">No Sci-Fi</option>
              <option value="0"></option>
            </select> &nbsp;
            <select v-model="originalLanguage"> 
              <option value="ja">Japanese</option>
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="0">All languages</option>
            </select> &nbsp;
            
            <button @click="resetChoices">Reset </button>
            
          </div><br>

          <input type="text" placeholder="Type to find a movie " v-model="movieString">&nbsp;
          <button @click="StringSearch('movie')" >Key word Search for Movies</button>
          <br><br>


          <input type="number" placeholder="Year " v-model="contentYear">&nbsp;
          <button @click="contentYearSearch(1)" >Popular movies from the year</button><br><br>

          <div v-on:change="decadeSearch">
              <select v-model="selectedDecades"> 
                <option value="1971">1971-1980</option>
                <option value="1981">1981-1990</option>
                <option value="1991">1991-2000</option>
                <option value="2001">2001-2010</option>
                <option value="2011">2011-2020</option>
                <option value="0">Best from decades</option>
              </select>
          </div><br>
 
        </div>
      </div>

      <div v-if="ShowRandom"><!-- showrandom-->
          <div> <!-- genre-->
            <div v-if="!showingMovie">
              <select v-model="chosenGenre" v-if="!showingMovie"> 
                <option value="10759">Action</option>
                <option value="16">Animation</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="9648">Mystery</option>
                <option value="10765">Sci-Fo</option>
                <option value="0">All Genres</option>
              </select> &nbsp;
              <select v-model="excludeGenre"> 
                <option value="10759">No Action</option>
                <option value="16">No Animation</option>
                <option value="35">No Comedy</option>
                <option value="18">No Drama</option>
                <option value="9648">No Mystery</option>
                <option value="10765">No Sci-Fo</option>
                <option value="0"></option>
              </select> &nbsp;
               <select v-model="originalLanguage"> 
                <option value="ja">Japanese</option>
                <option value="en">English</option>
                <option value="ko">Korean</option>
                <option value="0">All languages</option>
              </select> &nbsp;
              <button @click="seletAnime">Anime?</button> &nbsp;
              <button @click="resetChoices">Reset </button>

            </div>
            <div v-else>
              <select v-model="chosenGenre"> 
              <option value="28">Action</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="18">Drama</option>
              <option value="9648">Mystery</option>
              <option value="878">Sci-Fi</option>
              <option value="0">All Genres</option>
            </select> &nbsp;
            <select v-model="excludeGenre"> 
              <option value="28">No Action</option>
              <option value="16">No Animation</option>
              <option value="35">No Comedy</option>
              <option value="18">No Drama</option>
              <option value="9648">No Mystery</option>
              <option value="878">No Sci-Fi</option>
              <option value="0"></option>
            </select> &nbsp;
             <select v-model="originalLanguage"> 
              <option value="ja">Japanese</option>
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="0">All languages</option>
            </select> &nbsp;
            <button @click="seletAnime">Anime?</button> &nbsp;
            <button @click="resetChoices">Reset </button>

            </div>
            
          </div><br>
          between <input type="num" v-model="firstYear">
          and <input type="num" v-model="secondYear">

          <br><br>
          <button @click="randomGood">Random Search</button>&nbsp;
          <button @click="adRandom" v-if="currentUser.displayName === 'nisino25' && showingMovie">Adult movies</button>

      </div>
    </div>

    <div> <!-- Going through...-->
      <div class="reusult">
        <div class="title" v-if="count > 0">Going through {{ count }} movies</div>
      </div>
      
      <div class="reusult" v-if="!(paginationNeeded)|| (paginationNeeded && movieHit !==0 )">
        <!-- <div class="reusult" v-if="!(paginationNeeded)"> -->
        
        <div v-if="
            (showingMovie && shownTab === 'favorites' && MFaCount === 0) || 
            (showingMovie && shownTab === 'past' && MPaCount === 0) || 
            (showingMovie && shownTab === 'future' && MFuCount === 0) || 
            (!showingMovie && shownTab === 'favorites' && TFaCount === 0) || 
            (!showingMovie && shownTab === 'past' && TPaCount === 0) || 
            (!showingMovie && shownTab === 'future' && TMFuCount === 0) 
          ">
        </div>
        <div v-else>
          <strong class="title" v-if="movieHit > 0 && showingMovie">Showing {{ (showingPage * 20) - 19 }} - {{ (showingPage * 20) - 20 + movieHit }}
            <strong v-if="shownTab === 'searching'"> Movies</strong>
            <strong v-if="shownTab=== 'favorites' "> of {{MFaCount}} Movies</strong>
            <strong v-if="shownTab=== 'past' "> of {{MPaCount}} Movies</strong>
            <strong v-if="shownTab=== 'future' "> of {{MFuCount}} Movies</strong>
          </strong>

          <strong class="title" v-if="movieHit > 0 && !showingMovie">Showing {{ (showingPage * 20) - 19 }} - {{ (showingPage * 20) - 20 + movieHit }}
            <strong v-if="shownTab === 'searching'"> TV Shows</strong>
            <strong v-if="shownTab=== 'favorites' "> of {{TFaCount}} TV Shows</strong>
            <strong v-if="shownTab=== 'past' "> of {{TPaCount}} TV Shows</strong>
            <strong v-if="shownTab=== 'future' "> of {{TFuCount}} TV Shows</strong>
          </strong>


          <div v-if="shownTab === 'favorites' || shownTab === 'past' || shownTab === 'future'"><!-- Pagination for lists-->
            
            <div v-if="showingMovie && shownTab === 'favorites'">
              <button class="pagenation" v-for="index in roundUpMFa" :key="index"  @click="showLists(index,'favorites')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="showingMovie && shownTab === 'past'">
              <button class="pagenation" v-for="index in roundUpMPa" :key="index"  @click="showLists(index,'past')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="showingMovie && shownTab === 'future'">
              <button class="pagenation" v-for="index in roundUpMFu" :key="index"  @click="showLists(index,'future')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>


            <div v-if="!showingMovie && shownTab === 'favorites'">
              <button class="pagenation" v-for="index in roundUpTFa" :key="index"  @click="showLists(index,'favorites')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="!showingMovie && shownTab === 'past'">
              <button class="pagenation" v-for="index in roundUpTPa" :key="index"  @click="showLists(index,'past')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="!showingMovie && shownTab === 'future'">
              <button class="pagenation" v-for="index in roundUpTFu" :key="index"  @click="showLists(index,'future')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>


          </div>

        </div>


        <div v-if="showingYear !== 0"><!-- go to next year-->
          <button @click="changeingYear(parseInt(contentYear)-1)" v-if="movieHit > 0">{{parseInt(contentYear)-1}}</button>&nbsp;
          <strong class="title" v-if="movieHit > 0">from {{contentYear}}</strong>&nbsp;
          <button @click="changeingYear(parseInt(contentYear)+1)" v-if="movieHit > 0">{{parseInt(contentYear) +1}}</button>
        </div>

      </div> 

      <div v-if="shownTab === 'myFavLists'"><!-- pagination for fav lists -->
        <div v-if="paginationNeeded && movieHit !==0 && showingMovie" >
          <button class="pagenation" v-for="index in roundUpPAge" :key="index"  @click="showFavLists(index,'movie')">
              <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
              <strong v-else>{{index}}</strong>
          </button>&nbsp;
        </div>
        <div v-if="paginationNeeded && movieHit !==0 && !showingMovie" >
          <button class="pagenation" v-for="index in roundUpPAgeTv" :key="index"  @click="showFavLists(index,'tv')">
              <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
              <strong v-else>{{index}}</strong>
          </button>&nbsp;
        </div>
      
      </div>
    </div>



    
    <div  v-if="this.multipleContents"><!-- showing results--> 
      <br>

      <div v-if="condition === 'searchingRandom'"><!-- lodaing for adRandom search -->
        <!-- <strong class="overview">searching now</strong>  -->
        <div>
          <img src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""  >
        </div>
      </div>

      <div v-if="shownTab=== 'searching' && !multipleYears " ><!-- Showing pagination for searching-->
        <div v-if="showingMovie">
          <button class="pagenation" v-for="index in 10" :key="index"  @click="contentYearSearch(index,'movie')">
            <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
            <strong v-else>{{index}}</strong>
          </button>&nbsp;
        </div>

        <div v-else>
          <button velse class="pagenation" v-for="index in 10" :key="index"  @click="contentYearSearch(index,'tv')">
              <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
              <strong v-else>{{index}}</strong>
          </button>&nbsp;
        </div>
        
      </div>

      

      

      <div v-if="
            (showingMovie && shownTab === 'favorites' && MFaCount === 0) || 
            (showingMovie && shownTab === 'past' && MPaCount === 0) || 
            (showingMovie && shownTab === 'future' && MFuCount === 0) || 
            (!showingMovie && shownTab === 'favorites' && TFaCount === 0) || 
            (!showingMovie && shownTab === 'past' && TPaCount === 0) || 
            (!showingMovie && shownTab === 'future' && TMFuCount === 0) 
          ">
      </div>

      <table v-if="simplifyNeeded" ><!-- simplifytable -->
        <tr>
          <th>No.</th>
          <th>Title</th>
          <th>Country</th>
        </tr>
        <tr v-for="(result, i) in results" :key="i">
          <td v-if="!(multipleYears)" class="minutes">{{i + (showingPage * 20 -19) }} </td>
          <td v-if="showingMovie"> {{ result.original_title }}</td>
          <td v-else>{{result.original_name}} </td>
          <td>{{result.original_language}}</td>
        </tr>
      </table>
      <div  v-else v-for="(result, i) in results" :key="i">
        
        <div v-if="(i >= 20 && multipleYears) || !multipleYears ">
          
        
          <hr v-if="condition === 'randomSuccess'">

          
          <div>
            <div v-if="!(results.poster_path === '')">
              <div v-if="condition !== 'error'">  
                <!-- <li v-for="(result, i) in results" :key="i"> -->
                  
                <ul >
                  <div > <!-- title -->
                    <div v-if="showingMovie" class="reusult" >
                      <div v-if="!ShowRandom">
                        <strong v-if="!(multipleYears)" class="minutes">{{i + (showingPage * 20 -19) }}  </strong>&nbsp; &nbsp;<strong v-if="!(multipleYears)">  {{ result.original_title }} </strong>
                        <strong v-if="multipleYears && !decades" class="minutes">{{i-19}}  </strong>&nbsp; &nbsp;<strong v-if="multipleYears && !decades"> {{ result.original_title }} </strong>
                        <strong v-if="multipleYears && decades && (i-19) %  10 !==0 " class="minutes">{{result.release_date.substring(0,4)}}: NO.{{(i-19) %  10}}  </strong> &nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 !==0 " >  {{ result.original_title }} </strong>
                        <strong v-if="multipleYears && decades && (i-19) %  10 ===0" class="minutes">{{result.release_date.substring(0,4)}}: NO.{{10}}  </strong> &nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 ===0" >  {{ result.original_title }} </strong>
                      </div>

                      <div v-else>
                        <strong>{{i -19}}. </strong>&nbsp;
                        <strong class="minutes">NO.{{rankingLists[i-20].rank}} from {{rankingLists[i-20].year}}</strong><br>
                        <!-- <strong>---{{i}}---</strong> -->
                        <strong>  {{ result.original_title}} </strong>
                      </div>
                    </div>
                    

                    <div v-if="!showingMovie">
                      <div v-if="!ShowRandom">
                        <strong v-if="!(multipleYears)" class="minutes">{{i+ (showingPage * 20 -19) }}  </strong>&nbsp; &nbsp;<strong v-if="!(multipleYears)">  {{ result.original_name }}</strong>
                        <strong v-if="multipleYears && !decades" class="minutes">{{i-19}}  </strong>&nbsp; &nbsp;<strong v-if="multipleYears && !decades"> {{ result.original_name }} </strong>
                        <strong v-if="multipleYears && decades && (i-19) %  10 !==0 " class="minutes">{{result.first_air_date.substring(0,4)}}: NO.{{(i-19) %  10}}  </strong> &nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 !==0 " >  {{ result.original_name }} </strong>
                        <strong v-if="multipleYears && decades && (i-19) %  10 ===0" class="minutes">{{result.first_air_date.substring(0,4)}}: NO.{{10}}  </strong> &nbsp; &nbsp;<strong v-if="multipleYears && decades && (i-19) %  10 ===0" >  {{ result.original_name }} </strong>
                      </div>
                      <div v-else>
                        <strong>{{i -19}}. </strong>&nbsp;
                        <strong class="minutes">NO.{{rankingLists[i-20].rank}} from {{rankingLists[i-20].year}}</strong><br>
                        <!-- <strong>---{{i}}---</strong> -->
                        <strong>  {{ result.original_name}} </strong>
                      </div>
                    </div>
                  </div>

                  <div><!-- date and detail button -->
                    <div class="reusult">
                      <strong class="minutes" v-if="showingMovie">{{ result.release_date }}</strong>
                      <strong class="minutes" v-if="!showingMovie">{{ result.first_air_date }}</strong>
                    
                      &nbsp;

                      <button v-if="!detailNeeded" @click="toggleDetail">+ detail</button>
                      <button v-if="detailNeeded" @click="toggleDetail">- detail</button>

                    </div>
                  </div>

                  <div v-if="detailNeeded"><!-- link -->
                      <br>
                      <div v-if="tabMovieSelected">
                          <div v-if="result.adult">
                            <a v-bind:href="'https://www.themoviedb.org/search?query=' + result.original_title" target="_blank">TMDB</a>&nbsp;&nbsp;
                            <a v-bind:href="'https://www.google.com/search?q=movie '+ result.original_title" target="_blank">Check this on Google<br></a>
                          </div>
                          <div v-else>
                            <a v-bind:href="'https://www.themoviedb.org/movie/' + result.id" target="_blank">TMDB</a>&nbsp;&nbsp;
                            <a v-bind:href="'https://www.google.com/search?q=movie '+ result.original_title" target="_blank">Google<br></a>
                          </div>
                      </div>
                      <div v-if="!tabMovieSelected">
                          <div v-if="result.adult">
                            <a v-bind:href="'https://www.themoviedb.org/search?query=' + result.original_title" target="_blank">TMDB</a>&nbsp;&nbsp;
                            <a v-bind:href="'https://www.google.com/search?q=tv '+ result.original_name" target="_blank">Check this on Google<br></a>
                          </div>
                          <div v-else>
                            <a v-bind:href="'https://www.themoviedb.org/tv/' + result.id" target="_blank">TMDB</a>&nbsp;&nbsp;
                            <a v-bind:href="'https://www.google.com/search?q=tv '+ result.original_name" target="_blank">Google<br></a>
                          </div>
                      </div>
                  </div>

                  <div><!--toggle button -->
                    
                    <div v-if="!changingLists"> <!-- button-->
                      <br>
                      <div v-if="showingMovie">
                        <button v-if="isLoggedIn && !(!!MFaLists[result.id])" @click="toggleLists(result.id,'favorite')"  class="favButton" >Favorite<br></button>
                        <button v-if="isLoggedIn && (!!MFaLists[result.id])" @click="toggleLists(result.id,'favorite')" class="notfavButton">Favorite<br></button> &nbsp;

                        <button v-if="isLoggedIn && !(!!MPaLists[result.id]) &&!(!!MFaLists[result.id])" @click="toggleLists(result.id,'past')" class="pastButton" >Watched Before<br></button>
                        <button v-if="isLoggedIn && (!!MPaLists[result.id]) &&!(!!MFaLists[result.id])" @click="toggleLists(result.id,'past')" class="notpastButton">Watched before  <br></button>
                        <button v-if="isLoggedIn && (!!MFaLists[result.id])" @click="toggleLists(result.id,'past', true)" class="notpastButton">Watched before <br></button> &nbsp;

                        <button v-if="isLoggedIn && !(!!MFuLists[result.id]) &&!(!!MPaLists[result.id])" @click="toggleLists(result.id,'future')" class="futureButton" >Watch Later<br></button>
                        <button v-if="isLoggedIn && (!!MFuLists[result.id])" @click="toggleLists(result.id,'future')" class="notfutureButton">Watch Later<br></button>
                        <button v-if="isLoggedIn && (!!MPaLists[result.id])" @click="toggleLists(result.id,'future',true)" class="futureButton">Watch Later<br></button>
                        &nbsp;



                      </div>
                      <div v-if="!showingMovie">
                        <button v-if="isLoggedIn && !(!!TFaLists[result.id])" @click="toggleLists(result.id,'favorite')"  class="favButton" >Favorite<br></button>
                        <button v-if="isLoggedIn && (!!TFaLists[result.id])" @click="toggleLists(result.id,'favorite')" class="notfavButton">Favorite<br></button> &nbsp;

                        <button v-if="isLoggedIn && !(!!TPaLists[result.id]) &&!(!!TFaLists[result.id])" @click="toggleLists(result.id,'past')" class="pastButton" >Watched Before <br></button>
                        <button v-if="isLoggedIn && (!!TPaLists[result.id]) &&!(!!TFaLists[result.id])" @click="toggleLists(result.id,'past')" class="notpastButton">Watched before  <br></button> 
                        <button v-if="isLoggedIn && (!!TFaLists[result.id])" @click="toggleLists(result.id,'past', true)" class="notpastButton">Watched before <br></button> &nbsp;

                        <button v-if="isLoggedIn && !(!!TFuLists[result.id]) &&!(!!TPaLists[result.id])" @click="toggleLists(result.id,'future')" class="futureButton" >Watch Later<br></button>
                        <button v-if="isLoggedIn && (!!TFuLists[result.id])" @click="toggleLists(result.id,'future')" class="notfutureButton">Watch Later<br></button>
                        <button v-if="isLoggedIn && (!!TPaLists[result.id])" @click="toggleLists(result.id,'future',true)" class="futureButton">Watch Later<br></button>
                      </div>
                    </div>
                    <div v-else>
                      <div v-if="!(result.poster_path === null)">
                        <img src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""  >
                      </div>
                    </div>

                  </div>

                  <div v-if="detailNeeded"><!--Rating and popularitu -->
                    <div>
                      <div class="reusult">
                        <div class="title" v-if="result.vote_average !== 0">Rating: {{ result.vote_average }}</div>
                        <div class="title" v-else>No data </div>
                      </div>
                    </div>
                    <div>
                      <div class="reusult">
                        <div class="title" v-if="result.popularity !== null || result.popularity === 0">Popularity: {{ result.popularity }}</div>
                      </div>
                    </div>
                    

                  </div>
                  

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
          </div>
          <div v-if="
            (showingMovie && shownTab === 'favorites' && MFaCount === 0) || 
            (showingMovie && shownTab === 'past' && MPaCount === 0) || 
            (showingMovie && shownTab === 'future' && MFuCount === 0) || 
            (!showingMovie && shownTab === 'favorites' && TFaCount === 0) || 
            (!showingMovie && shownTab === 'past' && TPaCount === 0) || 
            (!showingMovie && shownTab === 'future' && TMFuCount === 0) 
          ">

          </div>
          
          <div  v-if="result.poster_path === null">
            <div v-if="condition !== 'searching'">
              <img src="data:image/png;base64,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">
            </div>
          </div>

          <div v-if="detailNeeded"> <!-- overview -->
            <div class="overview" v-if="result.overview !== ''"> 
                <strong id="overview">{{result.overview}}</strong>
            </div>
            <div class="overview" v-else>
              <div v-if="condition === 'randomSuccess'">
                <strong id="overview">No reviews yet</strong>
              </div>
            </div>
          </div>
          
        </div>
          <!-- <hr v-if="condition === 'randomSuccess'"> -->
        
      </div>
      <div v-if="
            (showingMovie && shownTab === 'favorites' && MFaCount === 0) || 
            (showingMovie && shownTab === 'past' && MPaCount === 0) || 
            (showingMovie && shownTab === 'future' && MFuCount === 0) || 
            (!showingMovie && shownTab === 'favorites' && TFaCount === 0) || 
            (!showingMovie && shownTab === 'past' && TPaCount === 0) || 
            (!showingMovie && shownTab === 'future' && TMFuCount === 0) 
          ">
          <strong class="overview">No contentents on this list</strong>
      </div>

      <div v-if="movieHit === 0 && countForLoop !== 0"><!-- cant find movie -->
          <strong class="overview">No movie with the keyword</strong>
      </div>

      <div v-if="countForLoop !==0 && countForLoop < 10 "><!-- lodaing for adRandom search -->
        <hr><br>
        <strong class="overview">{{20 - countForLoop}} more contents is coming now</strong>  
        <img src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt=""  >
      </div>  

    </div>


    <div><!--bottom part -->
      <div><!-- lists pagination bottom -->
        <div v-if="
                (showingMovie && shownTab === 'favorites' && MFaCount === 0) || 
                (showingMovie && shownTab === 'past' && MPaCount === 0) || 
                (showingMovie && shownTab === 'future' && MFuCount === 0) || 
                (!showingMovie && shownTab === 'favorites' && TFaCount === 0) || 
                (!showingMovie && shownTab === 'past' && TPaCount === 0) || 
                (!showingMovie && shownTab === 'future' && TMFuCount === 0) 
              ">
            </div>
        <div v-else>
          <hr>
          <strong class="title" v-if="movieHit > 0 && showingMovie">Showing {{ (showingPage * 20) - 19 }} - {{ (showingPage * 20) - 20 + movieHit }}
            <strong v-if="shownTab === 'searching'"> Movies from {{contentYear}}</strong>
            <strong v-if="shownTab=== 'favorites' "> of {{MFaCount}} movies</strong>
            <strong v-if="shownTab=== 'past' "> of {{MPaCount}} movies</strong>
            <strong v-if="shownTab=== 'future' "> of {{MFuCount}} movies</strong>
          </strong>

          <strong class="title" v-if="movieHit > 0 && !showingMovie">Showing {{ (showingPage * 20) - 19 }} - {{ (showingPage * 20) - 20 + movieHit }}
            <strong v-if="shownTab === 'searching'"> TV Shows {{contentYear}}</strong>
            <strong v-if="shownTab=== 'favorites' "> of {{TFaCount}} TV Shows</strong>
            <strong v-if="shownTab=== 'past' "> of {{TPaCount}} TV Shows</strong>
            <strong v-if="shownTab=== 'future' "> of {{TFuCount}} TV Shows</strong>
          </strong>


          <div v-if="shownTab === 'favorites' || shownTab === 'past' || shownTab === 'future'"><!-- Pagination for lists-->
            <br><br>
            <div v-if="showingMovie && shownTab === 'favorites'">
              <button class="pagenation" v-for="index in roundUpMFa" :key="index"  @click="showLists(index,'favorites')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="showingMovie && shownTab === 'past'">
              <button class="pagenation" v-for="index in roundUpMPa" :key="index"  @click="showLists(index,'past')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="showingMovie && shownTab === 'future'">
              <button class="pagenation" v-for="index in roundUpMFu" :key="index"  @click="showLists(index,'future')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>


            <div v-if="!showingMovie && shownTab === 'favorites'">
              <button class="pagenation" v-for="index in roundUpTFa" :key="index"  @click="showLists(index,'favorites')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="!showingMovie && shownTab === 'past'">
              <button class="pagenation" v-for="index in roundUpTPa" :key="index"  @click="showLists(index,'past')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>
            <div v-if="!showingMovie && shownTab === 'future'">
              <button class="pagenation" v-for="index in roundUpTFu" :key="index"  @click="showLists(index,'future')">
                  <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
                  <strong v-else>{{index}}</strong>
              </button>&nbsp;
            </div>


          </div>

        </div> 
      </div>

      <div v-if="shownTab=== 'searching' && !multipleYears  && paginationNeeded " ><!--  Bottom Showing pagination for searching-->
      <br>
      <div v-if="showingMovie">
        <button class="pagenation" v-for="index in 10" :key="index"  @click="contentYearSearch(index,'movie')">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
        </button>&nbsp;
      </div>
      <div v-else>
        <button class="pagenation" v-for="index in 10" :key="index"  @click="contentYearSearch(index,'tv')">
          <strong v-if="index === showingPage" class="displayedPage">{{index}}</strong>
          <strong v-else>{{index}}</strong>
        </button>&nbsp;
      </div>
    </div>

    <div v-if="showingYear !== 0"><!-- go to next year-->
      <br>
      <button @click="changeingYear(parseInt(contentYear)-1)" v-if="movieHit > 0">{{parseInt(contentYear)-1}}</button>&nbsp;
      <strong class="title" v-if="movieHit > 0">from {{contentYear}}</strong>&nbsp;
      <button @click="changeingYear(parseInt(contentYear)+1)" v-if="movieHit > 0">{{parseInt(contentYear) +1}}</button>
    </div>
    </div>
    

     



    <back-to-top text="Back to top"></back-to-top>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import firebase from 'firebase'
import { auth, AuthStore, db } from './main2.js'
import BackToTop from 'vue-backtotop'


export default defineComponent( {
  components: { BackToTop },

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
      firstPart: `https://api.themoviedb.org/3/movie/`,
      secondePart: `?api_key=3019330967bc149f12628b6c43bd5a32`,
      isFetchingMovie: false,
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
      
      movieString: '',
      movieHit: 0,
      testResult: {},
      multipleContents: false,

      contentYear: '',
      paginationNeeded: false,
      showingPage: 1,

      multipleYears: false,


      favoriteData: {},

      favLists: '',
      favMovieCount: 0,
      CountedAlredy: false,
      countCount: 0,
      pageForMyLists: false,
      MyListPage: 1,
      selectedDecades: 0,
      decades: false,

      showingMovie : true,
      favTvCount: 0,
      favoriteTvData: {},
      updatedTvLists: [],
      favTvLists: '',
      roundUpPAgeTv: '',

      serarchEngingSeleted: 'movies',
      tabMovieSelected: true,

      chosenGenre: '0',
      ApiURL: '',

      shownTab: 'menu',

      originalLanguage: '0',
      excludeGenre: '0',

      showingYear: 0,
      tvHit: 0,
      WithoutDate: '',

      ShowRandom: false,
      firstYear: 1995,
      secondYear: new Date().getFullYear(),

      randomYear: 0,
      randomNum: 0,
      specificIndex: 20,

      rememberME: true,
      remMe: true,
      remFirst: null,
      remSecond: null,

      rankingLists: {
        year: null,
        rank: null,
      },

      countForLoop: 0,
      adCheck: false,
      absCount: 0,
      JaCounter: 0,

      listLoopCount: 0,
      fireFolder: null,
      updatedLists: null,
      roundUpRep: null,
      countRep: 0,


      updatedMFaLists: [], 
      updatedMPaLists: [],
      updatedMFuLists: [],
      updatedTFaLists: [],
      updatedTPaLists: [],
      updatedTFuLists: [],

      MFaLists: [], 
      MPaLists: [],
      MFuLists: [],
      TFaLists: [],
      TPaLists: [],
      TFuLists: [],

      roundUpMFa: null,
      roundUpMPa: null,
      roundUpMFu: null,
      roundUpTFa: null,
      roundUpTPa: null,
      roundUpTFu: null,

      MFaCount: 0,
      MPaCount: 0,
      MFuCount: 0,
      TFaCount: 0,
      TPaCount: 0,
      TFuCount: 0,

      refMFa: null,
      refMPa: null,
      refMFu: null,
      refTFa: null,
      refTPa: null,
      refTFu: null,

      shownLists: null,
      firstApi: null,
      secondApi: null,
      shownType: null,

      changingLists: false,
      detailNeeded: false,
      simplifyNeeded: false,
      


    }

   },
  methods: {
    resetResult(){
      let resetCount = 0;
      while(resetCount < 1 ){
          this.results=  {
          original_title: '',
          poster_path: ``,
          release_date: '',
          popularity: '',
          vote_average: '',
          overview: '',
          runtime: '',
          results: '',
        };
        this.MovieNum= '';
        this.movieHit= 0;
        this.condition = 'waiting'
        this.count = 0
        this.multipleContents = false
        this.isFetchingMovie = false
        this.latest = ''
        this.MovieNum = ''
        this.query =''
        this.generatingCount= 0,
        this.search18=false,
        this.testResult= {},
        this.contentYear= '',
        this.paginationNeeded=false,
        this.showingPage= 1,
        this.multipleYears= false,
        this.countCount= 0,
        this.pageForMyLists= false,
        this.MyListPage= 1,
        this.selectedDecades= 0,
        this.decades= false,
        this.showingMovie =true,
        this.chosenGenre= '0',
        this.excludeGenre = '0',
        this.showingYear=  0,
        this.tvHit = 0,
        this.ShowRandom = false,
        this.countForLoop = 0;
        this.shownLists=  'favorites';
        this.simplifyNeeded =false;

        // this.firstYear = 1995
        
        this.rankingLists= {
          year: null,
          rank: null,
        },

        resetCount ++;

      }
    },
    changeTab(page){
      this.resetResult();
      this.shownTab = page
      if(page === 'favorites'){
        this.showLists(1,'favorites')

      }else if(page === 'past'){
        this.showLists(1,'past')

      }else if(page === 'future'){
        this.showLists(1,'future')

      }
      
      
    },
    async signInWithGoogle() {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider)
      
    },
    async signOut() {
      await auth.signOut()
      this.resetResult();
    },
    resetChoices(){
      this.originalLanguage = '0'
      this.chosenGenre= '0';
    },
    
    toggleTab(){
      this.rememberME = this.showingMovie
      this.resetResult()
      this.tabMovieSelected = !this.tabMovieSelected
      this.showingMovie = !this.rememberME
      
      console.log(this.showingMovie)
    },
    async decadeSearch(){
      if(this.selectedDecades === 0){
        return
      }
      this.decades = true;
      this.pageForMyLists = false;
      this.multipleYears = true;
      this.showingPage = 1
      this.paginationNeeded = true
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0;
      this.isImageLoaded = false;
      this.condition = 'searching';
      this.isFetchingMovie = true;
      let specificYear = this.selectedDecades;
      // const query = this.query

      if(this.showingMovie){
        this.WithoutDate = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1`
      }else{
        this.WithoutDate = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&page=1`
      }
      
      if(this.chosenGenre !== "0"){
        this.WithoutDate = `${this.WithoutDate}&with_genres=${this.chosenGenre}`
      }
      if(this.originalLanguage !== '0'){
        this.WithoutDate = `${this.WithoutDate}&with_original_language=${this.originalLanguage}`
      }
      if(this.excludeGenre !==0){
        this.WithoutDate = `${this.WithoutDate}&without_genres=${this.excludeGenre}`
      }

      if(this.showingMovie){
        this.ApiURL = `${this.WithoutDate}&primary_release_year=${specificYear}`
      }else{
        this.ApiURL = `${this.WithoutDate}&first_air_date_year=${specificYear}`
      }

      // &primary_release_year=${specificYear}
      // &first_air_date_year=${specificYear}

      console.log(this.ApiURL)
      const res = await fetch(this.ApiURL)
      const json = await res.json()
      this.results = json.results
      
      let MaxYear = parseInt(specificYear) + 10

      while(specificYear < MaxYear){
        const res = await fetch(this.ApiURL)
        const json = await res.json()
        let jsonCount = 0;
        while (jsonCount < 10){
          this.results =  this.results.concat(json.results[jsonCount])
          jsonCount++;
        }
        specificYear++;
        if(this.showingMovie){
          this.ApiURL = `${this.WithoutDate}&primary_release_year=${specificYear}`
        }else{
          this.ApiURL = `${this.WithoutDate}&first_air_date_year=${specificYear}`
        }
        

      }

      this.isFetchingMovie = false

      // console.log(this.results)
      this.condition = 'randomSuccess'
    },

    async idCheck(movieId){
      console.log(this.favLists)
      console.log(`Checking:${movieId}`)
      // if(!!this.updatedMovieFavoriteList //   console.log('yes')
      // }else{
      //   console.log('no')
      // }
      console.log(!!this.favLists[movieId])
    },
    async getLists(){
      this.decades = false
      
      this.favMovieCount = 0;
      this.favTvCount = 0;

      this.roundUpMFa= null
      this.roundUpMPa= null
      this.roundUpMFu= null
      this.roundUpTFa= null
      this.roundUpTPa= null
      this.roundUpTFu= null

      this.MFaCount= 0
      this.MPaCount= 0
      this.MFuCount =0
      this.TFaCount= 0
      this.TPaCount= 0
      this.TFuCount= 0
      
      // 1
      this.refMFa = db.collection("userMovieFavorites").doc(this.currentUser.uid)
      this.refMFa.get().then((doc) => {
        if (doc.exists) {
          this.MFaLists = doc.data()
          this.updatedMFaLists = []
          let i = 0;
          for (i in this.MFaLists){
            if(this.MFaLists[i]) {
              this.updatedMFaLists[this.MFaCount] = i
              this.MFaCount ++;
            } 
          }
          this.roundUpMFa = Math.ceil(this.updatedMFaLists.length /20)
        }
      });


      // 2
      this.refMPa = db.collection("userMoviePast").doc(this.currentUser.uid)
      this.refMPa.get().then((doc) => {
        if (doc.exists) {
          this.MPaLists = doc.data()
          // this.favLists = this.
          this.updatedMPaLists = []
          let i = 0;
          for (i in this.MPaLists){
            if(this.MPaLists[i]) {
              this.updatedMPaLists[this.MPaCount] = i
              this.MPaCount ++;
            } 
          }
          this.roundUpMPa = Math.ceil(this.updatedMPaLists.length /20)
        }
      });

      // 3
      this.refMFu = db.collection("userMovieFuture").doc(this.currentUser.uid)
      this.refMFu.get().then((doc) => {
        if (doc.exists) {
          this.MFuLists = doc.data()
          // this.favLists = this.MFuLists
          this.updatedMFuLists = []
          let i = 0;
          for (i in this.MFuLists){
            if(this.MFuLists[i]) {
              this.updatedMFuLists[this.MFuCount] = i
              this.MFuCount ++;
            } 
          }
          this.roundUpMFu = Math.ceil(this.updatedMFuLists.length /20)
        } 
        console.log(`count: ${this.MFuCount}`)
      });

      // 4
      this.refTFa = db.collection("userTvFavorites").doc(this.currentUser.uid)
      this.refTFa.get().then((doc) => {
        if (doc.exists) {
          this.TFaLists = doc.data()
          // this.favLists = this.TFaLists
          this.updatedTFaLists = []
          let i = 0;
          for (i in this.TFaLists){
            if(this.TFaLists[i]) {
              this.updatedTFaLists[this.TFaCount] = i
              this.TFaCount ++;
            } 
          }
          this.roundUpTFa = Math.ceil(this.updatedTFaLists.length /20)
        } 
      });

      // 5
      this.refTPa = db.collection("userTvPast").doc(this.currentUser.uid)
      this.refTPa.get().then((doc) => {
        if (doc.exists) {
          this.TPaLists = doc.data()
          // this.favLists = this.TPaLists
          this.updatedTPaLists = []
          let i = 0;
          for (i in this.TPaLists){
            if(this.TPaLists[i]) {
              this.updatedTPaLists[this.TPaCount] = i
              this.TPaCount ++;
            } 
          }
          this.roundUpTPa = Math.ceil(this.updatedTPaLists.length /20)
        }
      });

      // 6
      this.refTFu = db.collection("userTvFuture").doc(this.currentUser.uid)
      this.refTFu.get().then((doc) => {
        if (doc.exists) {
          this.TFuLists = doc.data()
          // this.favLists = this.TFuLists
          this.updatedLists = []
          let i = 0;
          for (i in this.TFuLists){
            if(this.TFuLists[i]) {
              this.updatedTFuLists[this.TFuCount] = i
              this.TFuCount ++;
            } 
          }
          this.roundUpTFu = Math.ceil(this.updatedTFuLists.length /20)
        } 
      });

      


      // console.log(this.MFaLists)
      this.CountedAlredy = true;
      
      
      
      
    },


    async showLists(page,type){
      console.log('jeuy')


      this.remMe = this.simplifyNeeded
      this.rememberME = this.showingMovie
      this.resetResult()
      this.showingMovie = this.rememberME
      this.simplifyNeeded = this.remMe

      this.decades = false;
      this.pageForMyLists = true;
      this.multipleYears = false;
      this.showingPage = page
      this.paginationNeeded = true
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0
      this.isImageLoaded = false
      this.condition = 'searching'
      this.isFetchingMovie = true
      this.countCount = 0;
      let fakeLists = [];
      let maxForPage = 0;
      this.shownType = type;

      this.condition = 'randomSuccess'



      if(this.showingMovie){
        if(type === 'favorites'){
          this.ApiURL = `${this.firstPart}${this.updatedMFaLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.MFaCount
          this.shownLists = this.updatedMFaLists

        }else if(type === 'past'){
          this.ApiURL = `${this.firstPart}${this.updatedMPaLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.MPaCount
          this.shownLists = this.updatedMPaLists

        }else if(type === 'future'){
          this.ApiURL = `${this.firstPart}${this.updatedMFuLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.MFuCount
          this.shownLists = this.updatedMFuLists

        }
      }else{
        if(type === 'favorites'){
          this.ApiURL = `https://api.themoviedb.org/3/tv/${this.updatedTFaLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.TFaCount
          this.shownLists = this.updatedTFaLists

        }else if(type === 'past'){
          this.ApiURL = `https://api.themoviedb.org/3/tv/${this.updatedTPaLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.TPaCount
          this.shownLists = this.updatedTPaLists

        }else if(type === 'future'){
          this.ApiURL = `https://api.themoviedb.org/3/tv/${this.updatedTFuLists[page*20 -20]}${this.secondePart}`
          this.countRep = this.TFuCount
          this.shownLists = this.updatedTFuLists
          
        }
      }
    
      this.countCount = page*20 -20
      const res = await fetch(this.ApiURL)
      const json = await res.json()
      fakeLists = fakeLists.concat(json)
      this.results= fakeLists
      this.countCount ++
      this.condition = 'randomSuccess'

      if(page* 20 >= this. countRep){
        maxForPage = this.countRep
      }else{
        maxForPage = page*20
      }

      console.log(`counconut: ${this.countCount}`)
      console.log(`macforpage:${maxForPage}`)
      while(this.countCount < maxForPage){
        if(this.showingMovie){
          this.ApiURL = `${this.firstPart}${this.shownLists[this.countCount]}${this.secondePart}`
        }else{
          this.ApiURL = `https://api.themoviedb.org/3/tv/${this.shownLists[this.countCount]}${this.secondePart}`
        }
        const res = await fetch(this.ApiURL)
        const json = await res.json()
        fakeLists = fakeLists.concat(json)
        this.countCount ++
        console.log('hey2')
      }
    
      this.isFetchingMovie = false
      
      

      this.results= fakeLists
      this.movieHit = this.results.length
      this.tvHit = this.results.length
    },

    togggleShowingMovie(){
      this.remMe = this.simplifyNeeded
      this.rememberME = this.showingMovie
      this.resetResult();
      this.showingMovie = !this.rememberME
      this.simplifyNeeded = this.remMe
      this.showLists(1,this.shownType)

    },


    async toggleLists(contentId, kind, needConfirmation ){
      this.changingLists = true;
      if(needConfirmation){
        let r= confirm('Are you sure you want to do that?');
        if(!r){
          return;
        }
      }

      if(this.showingMovie){
        if(kind === 'favorite'){
          let docRef = db.collection('userMovieFavorites').doc(this.currentUser.uid)
          console.log(contentId)
          console.log('movie: fav')

          let val = await docRef.get()
          let favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef2 = db.collection('userMoviePast').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: past')
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = true
            await docRef2.set(favoriteData2)


            let docRef3 = db.collection('userMovieFuture').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: future')
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }


        }else if(kind === 'past'){
          let docRef = db.collection('userMoviePast').doc(this.currentUser.uid)
          console.log(contentId)
          console.log('movie: past')

          const val = await docRef.get()
          const favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef3 = db.collection('userMovieFuture').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: future')
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }else{
            let docRef2 = db.collection('userMovieFavorites').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: favs')
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = false
            await docRef2.set(favoriteData2)

          }


        }else if(kind === 'future'){
          let docRef = db.collection('userMovieFuture').doc(this.currentUser.uid)
          console.log(contentId)
          console.log('movie: future')

          const val = await docRef.get()
          const favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef2 = db.collection('userMoviePast').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: past')
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = false
            await docRef2.set(favoriteData2)


            let docRef3 = db.collection('userMovieFavorites').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: favs')
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }

          
        }
        this.changingLists = false;

      }else{
        if(kind === 'favorite'){
          let docRef = db.collection('userTvFavorites').doc(this.currentUser.uid)
          console.log(contentId)
          // console.log('tv : fav')

          const val = await docRef.get()
          const favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef2 = db.collection('userTvPast').doc(this.currentUser.uid)
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = true
            await docRef2.set(favoriteData2)


            let docRef3 = db.collection('userTvFuture').doc(this.currentUser.uid)
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }

        }else if(kind === 'past'){
          let docRef = db.collection('userTvPast').doc(this.currentUser.uid)
          console.log(contentId)
          console.log('tv : past')

          const val = await docRef.get()
          const favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef3 = db.collection('userTvFuture').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: future')
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }else{
            let docRef2 = db.collection('userTvFavorites').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: favs')
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = false
            await docRef2.set(favoriteData2)

          }


        }else if(kind === 'future'){
          let docRef = db.collection('userTvFuture').doc(this.currentUser.uid)
          console.log(contentId)
          console.log('tv : future')

          const val = await docRef.get()
          const favoriteData = val.exists ? val.data() : {}
          favoriteData[contentId] = !favoriteData[contentId]
          await docRef.set(favoriteData)

          if(favoriteData[contentId]){
            let docRef2 = db.collection('userTvPast').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: past')
            const val2 = await docRef2.get()
            const favoriteData2 = val2.exists ? val2.data() : {}
            favoriteData2[contentId] = false
            await docRef2.set(favoriteData2)


            let docRef3 = db.collection('userTvFavorites').doc(this.currentUser.uid)
            // console.log(contentId)
            console.log('movie: favs')
            const val3 = await docRef3.get()
            const favoriteData3 = val3.exists ? val3.data() : {}
            favoriteData3[contentId] = false
            await docRef3.set(favoriteData3)
          }

          
        }
        this.changingLists = false;

      }

      this.getLists()
      // console.log(`${this.MFaLists[contentId]}, ${this.MPaLists[contentId]}, ${this.MFuLists[contentId]}`)
    },


    async changeingYear(year){
      window.scrollTo(0,650)
      this.contentYear = year
      this.contentYearSearch(1);
    },


    async contentYearSearch(page){
      if(page !== 1){
        window.scrollTo(0,650)
      }
      this.decades = false;
      this.pageForMyLists = false;
      this.multipleYears = false;
      this.showingPage = page
      this.paginationNeeded = true
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0
      this.isImageLoaded = false
      this.condition = 'searching'
      this.isFetchingMovie = true
      const query = this.query
      this.showingYear = this.contentYear;
      
      if(this.showingMovie){
        this.ApiURL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_adult=true&include_video=false&primary_release_year=${this.contentYear}&page=${page}`
      }else{
        this.ApiURL = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&first_air_date_year=${this.contentYear}&page=${page}&timezone=America%2FNew_York&include_null_first_air_dates=false`
      }


      if(this.chosenGenre !== "0"){
        this.ApiURL = `${this.ApiURL}&with_genres=${this.chosenGenre}`
      }
      if(this.originalLanguage !== '0'){
        this.ApiURL = `${this.ApiURL}&with_original_language=${this.originalLanguage}`
      }
      if(this.excludeGenre !==0){
        this.ApiURL = `${this.ApiURL}&without_genres=${this.excludeGenre}`
      }
      

      const res = await fetch(this.ApiURL)
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
      for (this.testResult in json) {
        console.log(`title: ${this.testResult.original_title}`)
      }


    },


    async searchMovie() {
      this.showingMovie = true
      this.decades = false;
      this.pageForMyLists = false;
      this.multipleYears = true;
      this.multipleContents = false;
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
    async StringSearch(type) {
      if(type === 'movie'){
        this.showingMovie = true
      }else{
        this.showingMovie = false
      }
      
      this.decades = false;
      this.pageForMyLists = false;
      this.multipleYears = false;
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0
      this.isImageLoaded = false
      this.condition = 'searching'
      this.isFetchingMovie = true
      const query = this.query
      console.log('heeeey')
      const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=3019330967bc149f12628b6c43bd5a32&query=${this.movieString } `)
      const json = await res.json()
      this.results = json.results
      this.movieHit = json.results.length
      console.log(json.results)

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
      this.showingMovie = true
      this.decades = false;
      this.multipleYears = true;
      this.multipleContents = false;
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

    toggleRandom(){
      console.log(`1: ${this.showingMovie}`)
      this.rememberME = this.ShowRandom
      this.remMe = this.showingMovie
      this.resetResult();
      this.ShowRandom = !this.rememberME
      this.showingMovie = this.remMe
      console.log(`2: ${this.showingMovie}`)
    },

    async randomGood(){
      // console.log(this.showingMovie)
      this.decades = true;
      this.pageForMyLists = false;
      this.multipleYears = true;
      this.showingPage = 1
      this.paginationNeeded = true
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0;
      this.isImageLoaded = false;
      this.condition = 'searching';
      this.isFetchingMovie = true;
      this.page = 1;
      this.isFetchingMovie = false
      this.condition = 'randomSuccess'
      
      //Get 20 items first //
      
      if(this.showingMovie){
        this.WithoutDate = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=popularity.desc&&include_adult=true&include_video=false`
      }else{
        this.WithoutDate = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&include_video=false&page=1`
        
      }

      if(this.showingMovie){
        this.ApiURL = `${this.WithoutDate}&primary_release_year=${this.secondYear}`
      }else{
        this.ApiURL = `${this.WithoutDate}&first_air_date_year=${this.secondYear}`
      }

      // console.log(this.ApiURL)
      const res = await fetch(this.ApiURL)
      const json = await res.json()
      this.results = json.results

      //20 is done 
      // move to the random ones


      let count = 0
      
      while(count < 20){
        this.randomNum = 0;
        this.specificYear = 0;
        this.page = 0;
        this.specificIndex = 20;


        while(this.randomNum < this.firstYear || this.randomNum > this.secondYear){
          this.randomNum = Math.random()
          this.randomNum = parseInt(this.randomNum * 5000)
          // console.log(this.randomYear)
        } 
        this.specificYear = this.randomNum
        this.randomNum = 0;

        while(this.randomNum<=0 || this.randomNum>=4){
          this.randomNum = Math.random()
          this.randomNum = parseInt(this.randomNum * 10)
        }
        this.page = this.randomNum
        this.randomNum = 20;

        while(this.random < 0 || this.randomNum >=10){
          this.randomNum = Math.random()
          this.randomNum = parseInt(this.randomNum * 50)
        }
        this.specificIndex = this.randomNum

        // console.log(`${count}: year: ${this.specificYear} page: ${this.page} i: ${this.specificIndex}`)


        if(this.showingMovie){
          this.WithoutDate = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=revenue.desc&include_video=false`
        }else{
          this.WithoutDate = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&&sort_by=popularity.desc&include_video=false&timezone=America%2FNew_York&include_null_first_air_dates=false`
          // this.WithoutDate = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&first_air_date_year=${this.contentYear}&page=${page}&timezone=America%2FNew_York&include_null_first_air_dates=false`
        }
        
        if(this.chosenGenre !== "0"){
          this.WithoutDate = `${this.WithoutDate}&with_genres=${this.chosenGenre}`
        }
        if(this.originalLanguage !== '0'){
          this.WithoutDate = `${this.WithoutDate}&with_original_language=${this.originalLanguage}`
        }
        if(this.excludeGenre !== '0'){
          this.WithoutDate = `${this.WithoutDate}&without_genres=${this.excludeGenre}`
        }

        if(this.showingMovie){
          this.ApiURL = `${this.WithoutDate}&primary_release_year=${this.specificYear}&page=${this.page}`
        }else{
          this.ApiURL = `${this.WithoutDate}&first_air_date_year=${this.specificYear}&page=${this.page}`
        }
        // console.log(this.ApiURL)
        //geting data now 
        const res = await fetch(this.ApiURL)
        const json = await res.json()
        this.results =  this.results.concat(json.results[this.specificIndex])
        // console.log(json.results[0].original_name)

        this.rankingLists[count]= {
          year:  this.specificYear,
          rank: this.specificIndex + (this.page * 20 -19) 
        }
        
        count++
      }
      this.isFetchingMovie = false
      this.condition = 'randomSuccess'
      // console.log(this.showingMovie)
    },
    async abRandom(){
    },
    async adRandom(){
      this.rememberME = this.showingMovie
      this.remFirst = this.firstYear
      this.remSecond = this.secondYear
      this.resetResult();

      this.showingMovie = this.rememberME
      this.firstYear = this.remFirst
      this.secondYear = this.remSecond
      this.ShowRandom = true;
      

      this.decades = true;
      this.pageForMyLists = false;
      this.multipleYears = true;
      this.showingPage = 1
      this.paginationNeeded = true
      this.multipleContents = true
      this.movieHit = 0;
      this.count =0;
      this.isImageLoaded = false;
      this.condition = 'searching';
      this.isFetchingMovie = true;
      this.page = 1;
      this.JaCounter= 0;
      //Get 20 items first //
      if(this.showingMovie){
        this.WithoutDate = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&sort_by=popularity.desc&&include_adult=true&include_video=false`
      }else{
        this.WithoutDate = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&include_video=false&page=1`
      }
      if(this.showingMovie){
        this.ApiURL = `${this.WithoutDate}&primary_release_year=${this.secondYear}`
      }else{
        this.ApiURL = `${this.WithoutDate}&first_air_date_year=${this.secondYear}`
      }
      // console.log(this.ApiURL)
      const res = await fetch(this.ApiURL)
      const json = await res.json()
      this.results = json.results

      //20 is done 
      // move to the random ones






      this.countForLoop = 0;
      this.absCount = 0;
      this.JaCounter = 0;
      this.adCheck =false;

      console.log('starts here!')
      this.condition = 'searchingRandom'

      
      while(this.countForLoop < 20){
        this.randomNum = 0;
        this.specificYear = 0;
        this.page = 0;
        this.specificIndex = 20;
        this.adCheck =false;


        while(this.randomNum < this.firstYear || this.randomNum > this.secondYear){
          this.randomNum = Math.random()
          this.randomNum = parseInt(this.randomNum * 5000)
          // console.log(this.randomYear)
        } 
        this.specificYear = this.randomNum
        this.randomNum = 0;

        

        while(this.randomNum<=20 || this.randomNum>=1000){
          this.randomNum = Math.random()
          this.randomNum = parseInt(this.randomNum * 100)
        }
        this.page = this.randomNum
        this.randomNum = 20;

        // while(this.random < 0 || this.randomNum >=10){
        //   this.randomNum = Math.random()
        //   this.randomNum = parseInt(this.randomNum * 50)
        // }
        // this.specificIndex = this.randomNum

        // console.log(`${count}: year: ${this.specificYear} page: ${this.page} i: ${this.specificIndex}`)


        if(this.showingMovie){
          this.ApiURL = `https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&primary_release_year=${this.specificYear}&page=${this.page}`
          //                  https://api.themoviedb.org/3/discover/movie?api_key=3019330967bc149f12628b6c43bd5a32&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1
        }else{
          this.ApiURL = `https://api.themoviedb.org/3/discover/tv?api_key=3019330967bc149f12628b6c43bd5a32&&sort_by=popularity.desc&timezone=America%2FNew_York&include_null_first_air_dates=false&include_adult=true&first_air_date_year=${this.specificYear}&page=${this.page}`
        }

        // if(this.showingMovie){
        //   this.ApiURL = `${this.WithoutDate}&primary_release_year=${this.specificYear}&page=${this.page}`
        // }else{
        //   this.ApiURL = `${this.WithoutDate}&first_air_date_year=${this.specificYear}&page=${this.page}`
        // }
        // console.log(this.ApiURL)
        //geting data now 
        const res = await fetch(this.ApiURL)
        const json = await res.json()

        console.log(`${this.specificYear}, p:${this.page} abs:${this.absCount} got ${this.countForLoop} movies`)
        
        console.log(json.results)
        this.JaCounter = 0;
        while(this.JaCounter < 20){
          if(json.results[this.JaCounter].adult && json.results[this.JaCounter].poster_path !== null){
            console.log(`Got here: ${this.specificYear}; p${this.showingPage}  index:${this.JaCounter} got ${this.countForLoop}movies so far`)
            this.results =  this.results.concat(json.results[this.JaCounter])
            this.rankingLists[this.countForLoop]= {
              year:  this.specificYear,
              rank: this.JaCounter+ (this.page * 20 -19) 
            }
            this.countForLoop++
            this.adCheck = true
            this.JaCounter = 30
            this.isFetchingMovie = false
            this.condition = 'randomSuccess'
          }
          this.JaCounter++
          // console.log(`${this.countForLoop}:${this.JaCounter}: abso:${this.absCount} `)
          // console.log(json.results[this.JaCounter])
        }
        // console.log('out of loop')
        this.absCount ++;

        // this.results =  this.results.concat(json.results[this.specificIndex])
        // console.log(json.results[0].original_name)

      } 
      console.log(this.results)

    },
    toggleDetail(){
      this.detailNeeded = !this.detailNeeded
    },
    toggleSimplify(){
      this.simplifyNeeded= !this.simplifyNeeded
    },
    seletAnime(){
      this.originalLanguage = 'ja'
      this.chosenGenre = '16'
    }
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
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tabSelected{
  color:grey
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


.favButton {
	background:	white;
  border-color: #FFD700;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;

}
.favButton:active {
	position:relative;
	top:1px;
}

.notfavButton {
	background:	#FFD700;
  border-color: grey;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;
}
.notfavButton:active {
	position:relative;
	top:1px;
}



.pastButton {
	background:	white;
  border-color: #32CD32;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;

}
.pastButton:active {
	position:relative;
	top:1px;
}

.notpastButton {
	background:	#32CD32;
  border-color: grey;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;
}
.notpastButton:active {
	position:relative;
	top:1px;
}




.futureButton {
	background:	white;
  border-color: 	#FF0000;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;

}
.futureButton:active {
	position:relative;
	top:1px;
}

.notfutureButton {
	background:		#FF0000;
  border-color: grey;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;
  color: white;
}
.notfutureButton:active {
	position:relative;
	top:1px;
}

.confirmfutureButton {
  background:	grey;
  border-color: 	#FF0000;
  border-radius:28px;
  font-size:17px;
	padding:10px 20px;
  border-width: thick;
  
}

.confirmfutureButton:active {
	position:relative;
	top:1px;
}

/* 
.movie-blue{
  color: blue
}

.tv-green{
  color: green
}

.total-red{
  color: red
} */



</style>
