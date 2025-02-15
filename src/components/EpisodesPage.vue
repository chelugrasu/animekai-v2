<template>
    <div class="background" v-if="this.seasons.length > 0">
        <div class="headerPhoto"><img class="headerPhoto" :src="getSeries('getHeaderImageUrl',series[0])" loading="lazy"><div class="coverHeaderPhoto"></div></div>
        <img class="posterPhoto" :src="getSeries('getPosterImageUrl',series[0])" loading="lazy">
        <p class="seriesTitle">{{ series[0].title }}</p>
        <div class="Details">
              <p>{{ getSeries('getGenres', series[0]) }}</p>
              <div class='smallLine'></div>
              <div class="rating" style="margin-left: 1.5vh;">
                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{  color: getSeries('getStarColor', series[0],series[0].rating, star) }" :icon="['fas', 'star']" size="sm" />
              </div>
              <div class='smallLine'></div>
              <div class="releaseYear" style="margin-left: 1.5vh;">{{ getSeries('getReleaseYear', series[0]) }}</div>
              <div class='smallLine'></div>
        </div>
        <div class="episodesButton" id="addListButton" @click='getVideoIdFromDiv("")'>
            <font-awesome-icon :icon="['fas', 'square-plus']" style="padding-right: 8px; margin-top: -1px; width: 18px; height: 18px;" />
            <p>Adauga în lista de vizionare</p>
        </div>
        <div class="episodesButton" id="shareButton">
            <font-awesome-icon :icon="['fas', 'share-from-square']" style="padding-right: 8px; margin-top: -1px; width: 18px; height: 18px;" />
            <p>Distribuie</p>
        </div>

        <div class="aboveMiddlePart">
          <div class="middlePart">
            <div class="description-container">
              <p>{{ series[0].description }}</p>
            </div>
            <p class="readMore">Read more</p>

            <div>
              <div :class="{seasonSelector : true, seasonSelectorActive: seasonSelectorActive}" @click="toggleSeasonSelector">
                <p>{{ getSeason(activeSeasonIndex) }}</p>
                <font-awesome-icon :class="{rotateArrow: seasonSelectorActive}" style="position: relative; right: -45px; transition: 0.3s ease;" :icon="['fas', 'chevron-down']" />
              </div>
              <div :class="{seasonsContainer: true, showSeasonsContainer: seasonSelectorActive}">
                <div
                  v-for="(season, index) in seasons"
                  :key="index"
                  :class="{ seasonContainer: true, activeSeason: activeSeasonIndex === index }"
                  @click="setActiveSeason(index)"
                >
                  <p>{{ getSeasonTitle(season) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="episodesList">
            <div v-for="(episode, index) in filteredEpisodes" :key="index" class="episode" @click="redirect(`/watch/${episode.episode_id}`)">
                <div class='episodeVideo'>
                    <font-awesome-icon class="playIcon" :icon="['fas', 'circle-play']" />
                    <img :src="episode.video_thumbnail" style="width: 100%; height: 100%; border-radius: 4.65px;" loading="lazy">
                    <div class="blackSide"></div>
                </div>
                <p class="episodeTitle">{{ episode.episode_title }}</p>
            </div>
          </div>
          <!-- <div v-else class="notLoggedIn">
            <font-awesome-icon class="notLoggedInIcon" :icon="['fas', 'otter']" />
            <p class="notLoggedInText">Din păcate nu poți viziona episoadele noastre<br>Fără a fii conectat la un cont validat<br><br><span class="notLoggedInSpan" @click="redirect('/register')">Înregistrează-te</span> sau <span class="notLoggedInSpan" @click="redirect('/register')">Conectează-te</span></p>
          </div> -->
        </div>

        <div class="leftSidePart">
          <div class="leftSideContainer">
            <p class="upperText">Data lansării</p>
            <p class="lowerText">{{ series[0].release_date }}</p>
          </div>
          <div class="leftSideContainer">
            <p class="upperText">Echipa implicată</p>
            <p class="lowerText"><span v-for="(member, index) in teamInvolved" :key="index" class="memberSelect" @click="redirect(`/member/${toLowerCase(member.name)}`)">
              {{ member.name }}
              <span v-if="index !== teamInvolved.length - 1">, </span>
            </span></p>
          </div>

          <p class="reviewsText">Recenzii recente</p>
          <div class="recentReviewsContainer">
            <div v-for="(review, index) in recentReviews" :key="index" class="recentReviewContainer">
              <div v-if="review.approved === 1">
                <p class="recentReviewName">{{ review.reviewer_name }}</p>
                <p class="recentReviewDate">{{ getDate(review.review_date) }}</p>
                <div class="rating" id="recentReviewRating">
                  <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{  color: getSeries('getStarColor', series[0],review.review_rating, star) }" :icon="['fas', 'star']" size="sm" />
                </div>
                <p class="recentReviewDescription">{{ review.review_description }}</p>
              </div>
            </div>
            <div class="episodesButton" id="allReviewsButton" @click="toggleAllReviews()">
              <font-awesome-icon :icon="['fas', 'ranking-star']" style="padding-right: 8px; margin-top: -2px; width: 22px; height: 22px;" />
              <p>Toate recenziile</p>
            </div> 
          </div>
        </div>

        <div v-if="showAllReviews" :class="{ 'allReviews': true}" @click="$event.target.classList.contains('allReviews') ? toggleAllReviews() : null">
          <div :class="{'allReviewsContainer': true,'allReviewsContainer-enter': showAllReviews}">
            <div class="allReviewsHeader">
              <font-awesome-icon style="position: absolute; left: 20px; top: 20px; color: white; cursor: pointer;" :icon="['fas', 'x']" size="xl" @click="toggleAllReviews"/>
              <p class="allReviewsTitle">Recenzii {{ series[0].title }}</p>
              <div class="allReviewsRating" style="transform: scale(1.4);">
                  <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getSeries('getStarColor', series[0],series[0].rating, star) }" :icon="['fas', 'star']" size="sm" />
              </div>
              <p class="allReviewsNumber">{{ reviews.length }} Recenzii</p>
            </div>

            <div v-for="(review, index) in reviews" :key="index" class="review">
              <div v-if="review.approved === 1">
                <img class="userProfilePicture" :src="getProfilePicture(review.reviewer_name)" loading="lazy">
                <div class="reviewerName">{{ review.reviewer_name }}
                  <div class="reviewRating">
                      <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getSeries('getStarColor', series[0],review.review_rating, star) }" :icon="['fas', 'star']" size="sm" />
                  </div>
                </div>
                <p class="reviewDate">{{ getDate(review.review_date) }}</p>
                <p v-if="review.review_spoiler == 1" class="reviewSpoiler">Conține spoiler</p>
                <p class="reviewDescription">{{ review.review_description }}</p>
              </div>
            </div>
            <div class="addReview" v-if="isLoggedIn">
              <div class="addReviewButton" @click="addReviewButton()">
                <p>Lasă o recenzie</p>
               </div>
               <div :class="{'addReviewContainer': true, 'addReviewContainer-enter': addReviewContainer}">
                <p class="addReviewRatingText">Rating<span style="color: rgb(255,0,0,.4);"> *</span></p>
                <div class="addReviewRating">
                  <font-awesome-icon 
                    v-for="(square, index) in stars" 
                    :key="index" 
                    @mouseover="toggleHighlight(index)"
                    @mouseleave="resetHighlight()"
                    @click="toggleClick(index)"
                    :icon="['fas', 'star']"
                    :class="{ 'highlightStar': index <= Math.max(hoverIndex, clickIndex) }"
                  />
                </div>
                <div class="checkBox" @click="checkBoxActive = !checkBoxActive">
                  <div :class="{'checkBoxActive': checkBoxActive}"></div>
                </div>
                <p class="addReviewSpoilerText">Conține spoiler?</p>
                <textarea v-text="reviewDescription" class="addReviewTextarea" maxlength="1500" placeholder="Scrie recenzia aici..." @input="currentCharacters = $event.target.value.length; reviewDescription = $event.target.value"></textarea>
                <p class="lengthCounter">{{ currentCharacters }} / 1500</p>
              </div>
            </div>
          </div>
        </div>

    </div>

    <div v-else style="display: flex; justify-content: center; align-items: center; font-size: 50px;">
      <p>Se încarcă, dacă nimic nu apare, aceasta pagină nu există</p>
    </div>
    
  </template>
  
  <script>
import router from '@/router';
export default {
  name: 'EpisodesPage',
  data() {
    return {
      seasonSelectorActive: false,
      activeSeasonIndex: 0,
      seasons: [],
      series: [],
      episodes: [],
      teamInvolved: [],
      recentReviews: [],
      reviews: [],
      isLoggedIn: false,
      userName: '',
      showAllReviews: false,
      addReviewContainer: false,
      stars: [1, 2, 3, 4, 5],
      hoverIndex: null,
      clickIndex: 0,
      checkBoxActive: false,
      currentCharacters: 0,
      reviewDescription: '',
      thumbnailUrls: []
    };
  },
  inject: ['setActiveHeaderButtonIndex'],
  methods: {
    getSeries(type, series, rating, star){
      if(series){
        if(type === 'getStarColor'){
          return star <= rating ? 'yellow' : 'gray'; // Adjust colors as needed
        }else if(type === 'getReleaseYear'){
          return new Date(series.release_date).getFullYear();
        }else if(type === 'getHeaderImageUrl'){
          const headerPhoto = `${series.url_slug}-headerPhoto.jpg`;
          let imageUrl;

          try {
            imageUrl = require(`@/assets/headerPhotos/${headerPhoto}`);
          } catch (error) {
            console.error('File does not exist:', error);
            // Fallback to a default image if the specified photo does not exist
            imageUrl = require(`@/assets/headerPhotos/photoInexistent-headerPhoto.jpg`);
          }
          return imageUrl;
        }else if(type ==='getPosterImageUrl'){
          const posterPhoto = `${series.url_slug}-posterPhoto.jpg`;
          let imageUrl;

          try {
            imageUrl = require(`@/assets/posterPhotos/${posterPhoto}`);
          } catch (error) {
            imageUrl = require(`@/assets/headerPhotos/photoInexistent-headerPhoto.jpg`);
          }

          return imageUrl;
        }else if(type ==='getGenres'){
            try {
            const genres = JSON.parse(series.genre);
            if (typeof genres !== 'object') {
              throw new Error('Genres is not an object');
            }
            return Object.values(genres).join(', ');
          } catch (error) {
            console.error('Error parsing genres:', error);
            return ''; // Return an empty string or handle the error as needed
          }
        }
      }
    },
    toggleSeasonSelector() {
      this.seasonSelectorActive = !this.seasonSelectorActive;
    },
    toLowerCase(name) {
      return name.toLowerCase();
    },
    getDate(object){
      const dateObj = new Date(object);
      const day = ('0' + dateObj.getDate()).slice(-2);
      const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    },
    async setActiveSeason(index) {
      this.activeSeasonIndex = index;
      this.toggleSeasonSelector();
    },
    getVideoPreview(hostname, video_url){
      /* eslint-disable-next-line no-useless-escape */
      const videoIdRegex = /\/embed\/[^\/?#]+\/([^\/?#]+)\??/;
      const videoId = video_url.match(videoIdRegex);
      if (videoId && videoId.length > 1) {
        const videoPreview = (`https://${hostname}/${videoId[1]}/thumbnail.jpg`);
        return videoPreview;
      } else {
        // Handle case where videoId is null or undefined
        return null; // or return a default value, throw an error, etc.
      }
    },
    getSeason(index){
      if(this.seasons){
        const season = this.seasons[index]
        const seasonTitle = season.title
        return seasonTitle
      }else{
        return
      }
    },
    getSeasonTitle(season){
      if(season){
        return season.title
      }
    },
    async checkUserToken() {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/isLoggedIn`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          const userData = await response.json();
          if(userData){
            this.isLoggedIn = true
            this.userName = userData.username
          }else(
            this.isLoggedIn = false
          )
        } catch (error) {
          console.error('Automatic login failed:', error);
          localStorage.removeItem('authToken');
        }
      }
    },
    redirect(page){
      router.push(page)
    },
    toggleAllReviews(){
      this.showAllReviews = !this.showAllReviews
    },
    getProfilePicture(user){
          const profilePicture = `${user.toLowerCase()}-profilePhoto.png`;
          let imageUrl;

          try {
            imageUrl = require(`@/assets/profilePhotos/${profilePicture}`);
          } catch (error) {
            imageUrl = require(`@/assets/profilePhotos/photoInexistent-profilePhoto.png`);
          }

          return imageUrl;
    },
    toggleHighlight(index) {
      this.hoverIndex = index;
    },
    resetHighlight() {
      if (this.clickIndex === null) {
        this.hoverIndex = null;
      }
    },
    toggleClick(index) {
      if (this.clickIndex === index) {
        this.clickIndex = null;
      } else {
        this.clickIndex = index;
      }
    },
    async addReviewButton(){
      if(this.currentCharacters > 0){
        if(this.isLoggedIn){
          const seriesName = this.$route.params.episodesPage;
          const formData = {
              seriesSlug: seriesName,
              username: this.userName,
              rating: this.clickIndex,
              isSpoiler: this.checkBoxActive,
              description: this.reviewDescription
          };
          try{
            const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/addReview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            });
            if (response.ok) {
              window.location.reload();
            }
          } catch(error){
              console.error('Error fetching data:', error);
          }
        }
      }else{
        this.addReviewContainer = !this.addReviewContainer
      }
    }
  },
  computed: {
    filteredEpisodes() {
      // Filter episodes based on the active season index
      if(this.episodes){
        // return null
        return this.episodes.filter(episode => episode.episode_season === this.seasons[this.activeSeasonIndex].season);
      }else{
        return null
      }
    }
  },
  async created() {
    this.setActiveHeaderButtonIndex(null)
    // Access the dynamic segment from the route parameters
    const seriesName = this.$route.params.episodesPage;
    this.checkUserToken()
    // Check if the dynamic segment matches the desired series name
    if (seriesName) {
        try{
            const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadEpisodesPage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seriesName })
            });
            if (response.ok) {
              const data = await response.json();
              const seriesData = data.seriesData
              const episodesData = data.episodesData
              const reviewsData = data.reviewsData
              const reviewsRecentData = data.reviewsData
              this.episodes = episodesData
              this.series = seriesData
              const seasons = JSON.parse(seriesData[0].seasons);
              this.seasons = Object.entries(seasons).map(([title, season]) => ({ title, season }));
              const inputObject = JSON.parse(seriesData[0].involved_team)
              this.teamInvolved = Object.entries(inputObject).map(([author, name]) => ({ author, name }));
              if(reviewsRecentData){
                reviewsRecentData.forEach(() => {
                  reviewsRecentData.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
                  this.recentReviews = reviewsRecentData.slice(0, 2);
                });
              }
              if(reviewsData){
                reviewsData.forEach(() => {
                  reviewsData.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
                  this.reviews = reviewsData
                });
              }
              const thumbnailPromises = this.filteredEpisodes.map(episode => this.getThumbnailUrl(episode.video_url));
              this.thumbnailUrls = await Promise.all(thumbnailPromises);
            }
        } catch(error){
            console.error('Error fetching data:', error);
        }
    }
  },
}
  </script>
  
  <style scoped>
.background {
  
    position: fixed; /* Use fixed position to cover the entire viewport */
    top: 0;
    left: 0;
    width: 100%; /* Set width to cover the entire viewport */
    bottom: 0; /* Position the background at the bottom of the viewport */
    overflow: auto; /* Enable scrolling if content exceeds viewport height */
    background-image: 
    radial-gradient(circle at center, rgba(255,255,255,.005) 0, rgba(255,255,255,0.005) 1px, transparent 1px),
    linear-gradient(to right, rgba(255,255,255, 0.01) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255, 0.01) 1px, transparent 1px);
    background-size: 50px 50px;
    background-color: #141414;
}


  .headerPhoto{
    position: absolute;
    top: 0px;
    left: 0px;
    height: 83vh;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    /* background-image: url(../assets/headerPhotos/solo-leveling-headerPhoto.jpg); */
  }
  .coverHeaderPhoto{
    position: relative;
    left: 0vh;
    top: 0vh;
    width: 100%;
    height: 100%;
    background: rgb(20,20,20);
    background: linear-gradient(0deg, rgba(20,20,20,1) 1%, rgba(0,0,0,0) 100%);
  }

  .posterPhoto{
    position: absolute;
    top: 590px;
    left: 350px;
    width: 262px;
    height: 392px;
    object-fit: cover;
    object-position: center center;
    outline: 0.2px solid rgba(255,255,255,0.1);
  }
  
  .seriesTitle{
    position: absolute;
    top: 605px;
    left: 670px;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 65px;
  }
  .Details{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 19px;
    color: rgba(255,255,255,.8);
    position: absolute;
    top: 750px;
    left: 670px;
    display: flex; /* Use flexbox */
    align-items: center; /* Align items vertically */
  }
  .smallLine {
  width: 1.5px;
  height: 21px;
  border-radius: 150px;
  background-color: rgb(128, 128, 128, 0.5);
  margin-left: 16px; /* Adjust spacing between text and line */
}
.star{
  margin-right: 4px;
}

.episodesButton{
    position: absolute;
    background-color: transparent;
    border-radius: 4.65px;
    outline: 2px solid rgba(255,255,255, .8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 15px;
    color: white;
    cursor: pointer;
    transition: 0.3s ease;
}

#addListButton{
    top: 830px;
    left: 670px;
    width: 240px;
    height: 60px;
}
#shareButton{
    top: 830px;
    left: 930px;
    width: 140px;
    height: 60px;
}
.episodesButton:hover{
    background-color: rgba(20,20,20,.5);
    outline: 2px solid var(--primary-color);
    color: var(--primary-color);
    filter: drop-shadow(0px 0px 5px var(--primary-color));
}

.aboveMiddlePart{
  position: absolute;
  display: flex;
  flex-direction: column; /* Align items in a column */
  top: 900px;
  left: 670px;
}

.middlePart {
  display: flex;
  flex-direction: column; /* Align items in a column */
  border-bottom: 1px solid rgb(255,255,255,.1);
  padding-bottom: 30px;
}

.description-container {  
  color: white;
  width: 850px;
  height: auto;
  line-height: 1.7;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  text-align: justify;
  color: white;
  margin-bottom: 0px;

}

.readMore {
  width: 85px;
  margin-bottom: 10px;
  color: var(--primary-color);
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 17px;
  transition: 0.3s ease;
  cursor: pointer;
}

.readMore::after {
  content: '';
  position: absolute;
  width: 85px;
  transform: scaleX(0);
  height: 2px;
  bottom: 110px;
  left: 0;
  background-color: var(--primary-color);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.readMore:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.seasonSelector{
  display: flex;
  margin-top: 10px;
  width: 220px;
  height: 60px;
  background-color: rgba(40,40,40, 0.5);
  color: white;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  border-radius: 4.65px;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.3s ease;
  user-select: none;
}

.seasonSelector:hover:not(.showSeasonsContainer){
  border: 2px solid white;
  filter: drop-shadow(0px 0px 5px rgb(175, 175, 175));
}


.seasonSelectorActive{
  filter: drop-shadow(0px 0px 5px var(--primary-color));
}
.rotateArrow{
  transform: rotate(180deg);
}


.seasonsContainer{
  position: absolute;
  transition: 0.3s ease;
  clip-path: inset(0 0 100% 0);
  width: 220px;
  max-height: 372px;
  height: auto;
  padding-bottom: 10px;
  border-radius: 4.65px;
  overflow-y: scroll;
  z-index: 1000;
  background-color: rgb(20, 20, 20, .9);
}

.showSeasonsContainer{
  clip-path: inset(-5% -5% -5% -5%);
}

.seasonContainer{
  position: relative;
  top: 0px;
  left: 5px;
  width: 204px;
  height: auto;
  background-color: rgba(40,40,40,0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4.65px;
  margin-top: 10px;
  filter: drop-shadow(0px 0px 3px rgb(175, 175, 175));
  transition: 0.3s ease;
}

.seasonContainer:hover{
  filter: drop-shadow(0px 0px 5px var(--primary-color));
}


.season{
  width: 100%;
  height: 30px;
  flex-grow: 0; /* Prevent items from growing */
  text-align: center;
}

.activeSeason{
  filter: drop-shadow(0px 0px 5px var(--primary-color));
}


.episode{
  width: 100%;
  height: 300px;
  border-bottom: 1px solid rgb(255,255,255,.1);
  display: flex;
  align-items: center;
}

.episodeVideo{
  position: relative;
  width: 400px;
  height: 250px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease;
  border-radius: 4.65px;
  cursor: pointer;
  outline: 1px solid transparent;
}

.episodeVideo:hover{
  transform: scale(1.075);
  filter: drop-shadow(0px 0px 8px var(--primary-color));
  outline: 2px solid var(--primary-color);
}
.episodeVideo:hover .playIcon{
  transform: scale(1.075);
}

.blackSide{
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  background-color: rgb(20,20,20, 0.45);
  border-radius: 4.65px;
}

.playIcon{
  transition: 0.3s ease;
  pointer-events: none;
  position: absolute;
  width: 55px;
  height: 55px;
  color: var(--primary-color);
  z-index: 1000;
}



.episodeTitle{
  position: relative;
  left: 50px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: white;
  min-width: auto;
  max-width: 400px;
}

.notLoggedIn{
  margin-top: 10px;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notLoggedInIcon{
  position: relative;
  color: rgb(255,255,255,.6);
  filter: drop-shadow(0px 0px 18px var(--primary-color));
  width: 160px;
  height: 160px;
  top: -100px;
  left: 0px;
  animation: myAnim 3s ease 0s normal forwards;
}

@keyframes myAnim {
	0% {
		opacity: 0;
		transform: translateY(250px) rotate(200deg);
	}

	100% {
		opacity: 1;
		transform: translateY(0) rotate(0deg);
	}
}

.notLoggedInText{
  position: absolute;
  margin-left: 10px;
  margin-top: 80px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 22px;
  color: white;
}
.notLoggedInSpan{
  color: var(--primary-color);
  cursor: pointer;
  filter: drop-shadow(0px 0px 4.65px var(--primary-color));
}
.notLoggedInSpan::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--primary-color);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.notLoggedInSpan:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.leftSidePart{
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 1020px;
  left: 350px;
}
.leftSideContainer{
  width: 262px;
  height: auto;
  background-color: rgba(40,40,40,.9);
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  color: white;
}

.upperText{
  color: rgb(255, 217, 0, .9);
  margin-left: 25px;
}
.lowerText{
  margin-left: 25px;
  font-weight: 400;
}

.memberSelect{
  cursor: pointer;
  transition: 0.3s ease;
  font-weight: 400;
}
.memberSelect:hover {
  color: var(--primary-color);
  filter: drop-shadow(0 0 4.65px var(--primary-color));
}

.reviewsText{
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 21px;
  color: white;
  margin-top: 15px;
}

.recentReviewsContainer{
  width: 100%;
  height: auto;
}

.recentReviewContainer{
  width: 262px;
  height: auto;
  border-bottom: 0.1px solid rgba(255,255,255,.1);
  margin-top: -20px;
  margin-bottom: 40px;
}

.recentReviewName{
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;;
  color: var(--primary-color);
}
.recentReviewDate{
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 13px;
  margin-top: -12px;
  color: gray;
}

#recentReviewRating{
  position: relative;
  top: -50px;
  left: 165px;
}
.recentReviewDescription{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 14px;
  margin-top: -15px;
  color: white;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

#allReviewsButton{
  margin-top: -25px;
  width: 100%;
}

.allReviews{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(10,10,10,.9);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.allReviewsContainer{
  position: absolute;
  width: 920px;
  height: 650px;
  background-color: rgb(40,40,40,1);
  border-radius: 4.65px;
  clip-path: inset(0px 50% 0px 50%);
  -webkit-clip-path: inset(0px 50% 0px 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  overflow-x: hidden;
  cursor: auto;
}

.allReviewsContainer-enter{
    animation: allReviewsContainer-enter 1.5s ease 0s 1 normal forwards;
}

@keyframes allReviewsContainer-enter {
  0% {
    clip-path: inset(0px 50% 0px 50%);
    -webkit-clip-path: inset(0px 50% 0px 50%);
   }
  100% {
     clip-path: inset(0px 0px 0px 0px);
     -webkit-clip-path: inset(0px 0px 0px 0px);
  }
}



.allReviewsHeader{
  position: sticky;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  border-bottom: 1px solid rgb(255,255,255,.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(40,40,40);
  z-index: 5000;
}

.allReviewsTitle{
  position: relative;
  top: 0;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 26px;
  color: white;
}

.allReviewsRating{
  margin-top: -20px;
}

.allReviewsNumber{
  margin-top: 5px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 17px;
  color: white;
}

.review{
  width: 100%;
  height: auto;
  border-bottom: 1px solid rgb(255,255,255, .1);
}

.userProfilePicture{
  position: relative;
  top: 25px;
  left: 30px;
  width: 40px;
  height: 40px;
  border-radius: 1000px;
  object-fit: cover;
  object-position: center center;
}

.reviewerName{
  position: relative;
  top: -18px;
  left: 78px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 17px;
  display: flex;
  flex-direction: row;
  color: var(--primary-color);
}

.reviewDate{
  position: relative;
  top: -29px;
  left: 78px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: gray;
  margin-bottom: 30px;
}

.reviewSpoiler{
  position: relative;
  top: -50px;
  left: 30px;
  text-align: left;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: rgb(255, 0, 0, .6);
}

.reviewDescription{
  margin-top: -40px;
  margin-left: 30px;
  margin-bottom: 30px;
  width: 93%;
  height: auto;
  max-height: 260px;
  overflow: hidden;
  text-align: justify;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 14.5px;
  line-height: 22px;
  letter-spacing: 0.5px;
  color: white;
}

.reviewRating{
  margin-left: 10px;
  transform: scale(1.1);
}

.addReview{
  position: fixed;
  width: 920px;
  bottom: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.addReviewButton{
  z-index: 1000;
  width: 200px;
  border-top-right-radius: 4.65px;
  border-top-left-radius: 4.65px;
  height: 40px;
  background-color: rgb(246, 183, 0, .3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14.5px;
  color: white;
  transition: 0.3s ease;
  cursor: pointer;
}
.addReviewButton:hover{
  transform: scale(1.1);
  font-size: 14.5px;
  filter: drop-shadow(0 0 10px var(--primary-color));
}


.addReviewContainer{
  width: 99%;
  background-color: rgb(45,45,45);
  height: 0px;
  display: flex;
  flex-direction: column;
  clip-path: inset(50% 0 50% 0);
  -webkit-clip-path: inset(50% 0 50% 0);
}

.addReviewContainer-enter{
  animation: addReviewContainer-enter 1.5s ease 0s 1 normal forwards;
}

@keyframes addReviewContainer-enter {
  0% {
    height: 0px;
    clip-path: inset(50% 0 50% 0);
    -webkit-clip-path: inset(50% 0 50% 0);
   }
  100% {
    height: 250px;
     clip-path: inset(0px 0px 0px 0px);
     -webkit-clip-path: inset(0px 0px 0px 0px);
  }
}

.addReviewRatingText{
  margin-left: 30px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 15px;
  color: white;
}
.addReviewRating{
  margin-top: -5px;
  margin-left: 110px;
  transform: scale(1.2);
  color: gray;
  display: flex;
  flex-direction: row;
  gap: 2px;
}
.highlightStar {
  cursor: pointer;
  transition: color 0.3s ease;
  color: var(--primary-color);
  filter: drop-shadow(0 0 3px var(--primary-color));
}


.checkBox{
  margin-top: 20px;
  margin-left: 30px;
  width: 18px;
  height: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  outline: 2px solid var(--primary-color);
  cursor: pointer;
}

.checkBoxActive{
  width: 60%;
  height: 60%;
  border-radius: 100px;
  background-color: var(--primary-color);
  filter: drop-shadow(0 0 5px var(--primary-color));
  transition: 0.3s ease;
}

.addReviewSpoilerText{
  margin-top: -18px;
  margin-left: 55px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: white;
}

.addReviewTextarea {
  margin-left: 30px;
  width: 90%;
  height: 90px;
  padding: 15px;
  resize: none;
  overflow-wrap: break-word;
  background-color: rgb(40,40,40);
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: white;
  outline: none;
  border: none;
  border-radius: 4.65px;
}

.lengthCounter{
  margin-top: -140px;
  margin-left: 820px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 13px;
  color: white;
  transition: 0.3s ease;
}
  </style>
  