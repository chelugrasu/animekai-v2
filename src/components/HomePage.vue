<template>
    <div class="BackgroundOverlay"></div>
    <div class="swiper-containerBig">
      <div class="swiper-wrapper">
        <div v-for="series in mostRecentSeries" :key="series.id" class="swiper-slide" id="swiper-slideBig" @click="handleSeriesClick(series)">
          <div class="slide-content">
            <img class="bigSwiper-Image" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            <div class="blackSide"></div>
            <h2 class="Title">{{ series.title }}</h2> 
            <div class="Details">
              <p>{{ getGenres(series.genre) }}</p>
              <div class='smallLine'></div>
              <div class="rating" style="margin-left: 1.5vh;">
                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getStarColor(series.rating, star) }" :icon="['fas', 'star']" size="sm" />
              </div>
              <div class='smallLine'></div>
              <div class="releaseYear" style="margin-left: 1.5vh;">{{ getReleaseYear(series.release_date) }}</div>
              <div class='smallLine'></div>
            </div>
            <div class="Description">{{ series.description }}</div>
            <div class="watchButton" @click="redirect(series.url_slug)">
              <p>Vizonează</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="SlideButton" id="previousSlideButton" @click="slidePage('left')"><font-awesome-icon class="arrowLeftIcon" :icon="['fas', 'chevron-left']" /></div>
    <div class="SlideButton" id="nextSlideButton" @click="slidePage('right')"><font-awesome-icon class="arrowRightIcon" :icon="['fas', 'chevron-right']" /></div>
  <div class="Genres">
      <p class="Genre" style="padding-top: 102.5vh;">Acțiune</p>
      <div class="swiper-container" id="swiper-container">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in actionSeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <!-- Series content for the action genre -->
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>

            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>

      <p class="Genre" style="padding-top: 2.5vh;">Aventură</p>
      <div class="swiper-container" id="swiper-container" style="padding-top: 10vh;">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in adventureSeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            
            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>
      <p class="Genre" style="padding-top: 2.5vh;">Dramă</p>
      <div class="swiper-container" id="swiper-container" style="padding-top: 10vh;">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in dramaSeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>

            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>
      <p class="Genre" style="padding-top: 2.5vh;">Fantezie</p>
      <div class="swiper-container" id="swiper-container" style="padding-top: 10vh;">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in fantasySeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            
            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>
      <p class="Genre" style="padding-top: 2.5vh;">Comedie</p>
      <div class="swiper-container" id="swiper-container" style="padding-top: 10vh;">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in comedySeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            
            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>
      <p class="Genre" style="padding-top: 2.5vh;">Sci-Fi</p>
      <div class="swiper-container" id="swiper-container" style="padding-top: 10vh;">
        <div class="swiper-wrapper swiper-wrapperSmall">
          <div v-for="series in scifiSeries" :key="series.id" @click="redirect(series.url_slug)" class="swiper-slide swiper-slideSmall">
            <img class="swiper-Picture" :src="getBackgroundImageUrl(series)" loading="lazy">
            <div class="swiper-lazy-preloader"></div>

            <div class="bottomBar">
              <h2 class="smallSlideTitle">{{ series.title }}</h2>
            </div>
          </div>
        </div>
      </div>
  </div>
  <div class="footer">
    <p class="joinUsText">Join us</p>
    <font-awesome-icon class="footerIcon" style="width: 2vw; height: 6vh;" :icon="['fab', 'discord']" />
    <font-awesome-icon class="footerIcon" style="width: 2vw; height: 4.5vh;" :icon="['fab', 'instagram']"/>
    <font-awesome-icon class="footerIcon" style="width: 1.5vw; height: 4.5vh;" :icon="['fab', 'tiktok']"/>
    <div class="leftTab">
      <p class="leftTabText">Politica de confidențialitate</p>
      <p class="leftTabText">Echipa noastră</p>
      <p class="leftTabText">Contactează-ne</p>
    </div>
    <div class='footerLogo'></div>
    <div class="supportButton">
      <p>Sustine Proiectul</p>
    </div>
  </div>
</template>
  
  <script>
  import router from '@/router';
  import Swiper from 'swiper';
  import 'swiper/swiper-bundle.css'; // Import Swiper styles
  export default {
    name: 'HomePage',
    data() {
      return {
        mostRecentSeries: [],
        actionSeries: [],
        adventureSeries: [],
        dramaSeries: [],
        fantasySeries: [],
        comedySeries: [],
        scifiSeries: [],
        isActive: false,
        isLoggedIn: false,
        userName: ''
      };
    },
    inject: ['checkUserToken'],
    methods: {
    async loginDiscord(fragment){
      const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

      if (accessToken) {
        const fetchResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${tokenType} ${accessToken}`,
          },
        });
        if (fetchResponse.ok) {
          const responseData = await fetchResponse.json();
          const { username, email } = responseData;
          // set the welcome username string
          const formData = {
            loginType: 'discord',
            usernameValue: username,
            emailValue: email,
            checkedBox: true,
          }
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const data = await response.json();
              const token = data.token;
              localStorage.setItem('authToken', token); // Store token in local storage
              router.push("/home")
              this.checkUserToken()
              return
        }
        } else {
          // Handle fetch error
        }
      }
    },
    async loadHomePage(){
      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadHomePage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Initialize separate arrays for each genre
          this.actionSeries = [];
          this.adventureSeries = [];
          // Add more arrays for other genres if needed

          data.series.forEach(() => {

            data.series.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));

            // Select the three most recent series
            this.mostRecentSeries = data.series.slice(0, 3);
            // Add more else if conditions for other genres if needed
          });
          this.actionSeries = await this.getRandomSeries(data.series, 'Acțiune');
          this.adventureSeries = await this.getRandomSeries(data.series, 'Aventură');
          this.dramaSeries = await this.getRandomSeries(data.series, 'Dramă');
          this.fantasySeries = await this.getRandomSeries(data.series, 'Fantezie');
          this.comedySeries = await this.getRandomSeries(data.series, 'Comedie');
          this.scifiSeries = await this.getRandomSeries(data.series, 'Sci-Fi');
          this.initSwipers();
        }
      },
        initSwipers() {
          this.initSwiper('.swiper-containerBig');
          this.initSwiper('#swiper-container');
        },
        initSwiper(containerSelector) {
          if(containerSelector === '.swiper-containerBig'){
            new Swiper(containerSelector, {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 5,
            loop: true,
            speed: 500,
            lazy: true,
          });
          }else{
            new Swiper(containerSelector, {
            direction: 'horizontal',
            slidesPerView: 6.35,
            spaceBetween: 10,
            loop: true,
            speed: 500,
          });
          }
          // Initialize Swiper instance for the given container
        },
        async getRandomSeries(allSeries, genre) {
          // Filter series by genre
          const genreSeries = allSeries.filter(series => {
            const genres = JSON.parse(series.genre);
            return Object.values(genres).includes(genre);
          });

          // Shuffle the series array randomly
          const shuffledSeries = this.shuffleArray(genreSeries);

          // Limit the number of series to a maximum of 15
          const maxSeries = shuffledSeries.slice(0, 15);

          return maxSeries;
        },
        shuffleArray(array) {
          // Fisher-Yates shuffle algorithm
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        },
      handleSeriesClick(series) {
        console.log(series.title); // Handle series click event
      },
      getStarColor(rating, star) {
        return star <= rating ? 'yellow' : 'gray'; // Adjust colors as needed
      },
      getReleaseYear(releaseDate) {
        return new Date(releaseDate).getFullYear();
      },
      getGenres(genreObj) {
        try {
          const genres = JSON.parse(genreObj);
          if (typeof genres !== 'object') {
            throw new Error('Genres is not an object');
          }
          return Object.values(genres).join(', ');
        } catch (error) {
          console.error('Error parsing genres:', error);
          return ''; // Return an empty string or handle the error as needed
        }
      },
      getBackgroundImageUrl(series) {
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
    },
    slidePage(direction) {
      var bigSwiper = document.querySelector('.swiper-containerBig').swiper;
      if(direction === 'right'){
        if (bigSwiper) {
          bigSwiper.slideNext();
        }
      }else{
        if (bigSwiper) {
          bigSwiper.slidePrev();
        }
      }
    },
    toggleOptionsContainer(){
      console.log(this.isActive)
      this.isActive = !this.isActive
    },
    logOut(){
      localStorage.removeItem('authToken');
      window.location.reload();
    },
    redirect(url_slug){
    router.push(`/${url_slug}`)
    },
  },
  mounted() {
    this.loadHomePage()
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    this.loginDiscord(fragment)
    this.checkUserToken()
    },
}
  </script>
  
  <style scoped>
  
  
  .BackgroundOverlay{
position: absolute;
  height: 300vh;
  top: -0.05vh;
  left: 0vh;
  width: 100%;
  background-image: 
  radial-gradient(circle at center, rgba(255,255,255,.005) 0, rgba(255,255,255,0.005) 0.05vw, transparent 0.05vw),
  linear-gradient(to right, rgba(255,255,255, 0.01) 0.05vw, transparent 0.05vw),
  linear-gradient(to bottom, rgba(255,255,255, 0.01) 0.05vw, transparent 0.05vw);
  background-size: 2.5vw 2.5vw;
  background-attachment: fixed;
  background-color: #141414;
}

.swiper-containerBig{
    position: absolute;
    left: 0vh;
    width: 99.2vw;
    height: 98vh;
    overflow: hidden;
  }
  #swiper-slideBig{
    border-radius: 0.35vh;
    outline: 0.25vh solid rgba(63, 63, 63, 0);
  }

  .bigSwiper-Image{
    position: absolute;
    width: 100%;
    height: 101%;
    object-fit: cover;
    object-position: center center;
  }

  .blackSide{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(10,10,10,0.75) 45%, rgba(0,0,0,0) 100%);
  }

  .Title{
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 7vh;
    letter-spacing: 0vh;
    color: white;
    position: absolute;
    top: 31vh;
    left: 17vh;
  }

  .Details{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1.8vh;
    letter-spacing: 0vh;
    color: rgba(255,255,255,.8);
    position: absolute;
    top: 45vh;
    left: 17vh;
    display: flex; /* Use flexbox */
    align-items: center; /* Align items vertically */
  }
  .smallLine {
  width: 0.15vh;
  height: 2vh;
  border-radius: 15vh;
  background-color: rgb(128, 128, 128, 0.5);
  margin-left: 1.5vh; /* Adjust spacing between text and line */
}
.star{
  margin-right: 0.35vh;
}

.Description{
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.7vh;
  line-height: 2.5vh;
  letter-spacing: 0.05vh;
  text-align: justify;
  color: rgba(255,255,255,.75);
  position: absolute;
  top: 51vh;
  left: 17vh;
  max-width: 55vh;
  max-height: 15vh;
  overflow: hidden;
}

.watchButton{
  user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 2vh;
    color: white;
    position: absolute;
    top: 68.5vh;
    left: 17vh;
    width: 20vh;
    height: 6vh;
    background-color: rgba(29,29,29,0.25);
    border-radius: 0.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.35s;
    outline: 0.25vh solid gray;
}
.watchButton:hover{
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    outline: 0.25vh solid var(--primary-color);
    color: var(--primary-color);
}

.header{
  position: fixed;
  top: 0vh;
  left: 0vh;
  width: 100vw;
  height: 6vh;
  background-color: rgb(20, 20, 20, 0.9);
  z-index: 1000; /* Ensure the header is above other content */
}

.logo{
  position: absolute;
    left: 1.5vh;
    top: 1.5vh;
    z-index: 5;
    height: 2.5vh;
    width: 22.5vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(../assets/LogoText.png);
}


.headerButton{
  user-select: none;
  cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 1.5vh;
    color: white;
  position: absolute;
  top: 0vh;
  width: 5.5vw;
  height: 5.5vh;
  background-color: rgba(10,10,10,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.35s;
  filter: drop-shadow(0vh 0vh 0.05vh rgba(246, 183, 0, 0));
  border-top: 0.25vw solid rgb(0,0,0,0);
}
.headerButton:hover{
  filter: drop-shadow(0vh 0vh 0.05vh rgba(246, 183, 0, 0.75));
  border-top: 0.25vw solid var(--primary-color);
}

#homeButton{
  left: 23vh;
  filter: drop-shadow(0vh 0vh 0.05vh rgba(246, 183, 0, 0.75));
  border-top: 0.25vw solid var(--primary-color);
}

.headerButtonIcon{
  position: relative;
  left: -0.5vh;
  top: -0.15vh;
}

.SlideButton{
    position: absolute;
    width: 3vw;
    height: 6vh;
    top: 45vh;
    background-color: rgba(29,29,29,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10vh;
    cursor: pointer;
    transition: 0.35s;
    z-index: 100;

}
.SlideButton:hover{
    background-color: rgb(80, 80, 80);
}

#previousSlideButton{
    left: 1vh;
}
.arrowLeftIcon{
    color: white;
    width: 3vh;
    height: 3vh;
}

#nextSlideButton{
    right: 1vh;
}
.arrowRightIcon{
    color: white;
    width: 3vh;
    height: 3vh;
}

.optionsButton{
  position: absolute;
  display: flex; /* Use flexbox */
  align-items: center; /* Align items vertically */
  right: 5vh;
  top: 0.75vh;
  user-select: none;
  cursor: pointer;
}
.optionsButtonIcon{
  color: white;
  width: 2vw;
  height: 3.25vh;
}
.optionsButtonText{
  margin-left: 0.5vh;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 1.35vh;
  color: white;
}

.optionsContainer{
  position: absolute;
  right: 4vh;
  top: 6vh;
  width: 11vw;
  height: 19vh;
  clip-path: inset(0 0 100% 0);
  border-radius: 0vh 0vh 1vh 1vh;
  background-color: rgba(20,20,20, 0.9);
  transition: 0.75s clip-path ease;
}
.optionsContainer-active{
  clip-path: inset(0 0 0 0);
}

@keyframes reveal {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.optionButton{
  position: absolute;
  cursor: pointer;
  left: 3vh;
  top: 0vh;
  width: 8vw;
  height: 3vh;
  background-color: transparent;
  border-bottom: 0.01vh solid rgb(255,255,255,0.075);
  border-radius: 0.25vh;
  display: flex;
  align-items: center;
}
.optionButtonIcon{
  pointer-events: none;
  color: white;
  position: absolute;
  top: 0vh;
  left: 1vh;
  transition: transform 0.3s ease;
  transition: 0.3s ease;
}
.optionButtonText{
  user-select: none;
  pointer-events: none;
  position: absolute;
  top: -1.25vh;
  left: 3vh;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.35vh;
  color: white;
  transition: transform 0.3s ease;
  transition: 0.3s ease;
}
.optionButtonDot{
  position: absolute;
  top: 0.5vh;
  left: 1vh;
  width: 0.2vw;
  height: 0.4vh;
  border-radius: 10vh;
  background-color: var(--primary-color);
  opacity: 0;
  transition: 0.3s opacity ease;
}
.optionButton:hover .optionButtonIcon,
.optionButton:hover .optionButtonText{
  color: var(--primary-color);
  transform: translateX(1vh);
}
.optionButton:hover .optionButtonDot{
 opacity: 1;
}

.logInButton{
  position: absolute;
  top: 1vh;
  right: 5vh;
  width: 5vw;
  height: 4vh;
  background-color: rgba(20,20,20,0);
  border-radius: 0.25vw;
  outline: 0.12vw solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.25vh;
  color: white;
  transition: 0.5s ease;
  cursor: pointer;
}
.logInButton:hover{
  outline: 0.12vw solid var(--primary-color);
  color: var(--primary-color);
  background-color: rgba(20,20,20,0.5);
  filter: drop-shadow(0 0 0.25vw var(--primary-color));
}

.Genre{
  user-select: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 3vh;
  color: rgb(255, 255, 255, .85);
  position: absolute;
  left: 1vh;
}

  .swiper-container{
    position: relative;
    left: 0vh;
    width: 98.7vw;
    height: 17.5vh;
    overflow: hidden;
    padding-top: 110vh;
  }
  .swiper-wrapperSmall{
    height: 17vh;
  }
  .swiper-slideSmall{
    user-select: none;
    border-radius: 0.35vh;
    cursor: pointer;
    outline: 0.25vh solid rgba(63, 63, 63, 0);
    transition: 0.5s transform ease;
  }
  .swiper-slideSmall:hover{
    transition: 0.5s transform ease;
    outline: 0.15vw solid var(--primary-color);
    transform: scale(1.15) translateY(-2vh);
    z-index: 200;
    filter: drop-shadow(0vw 0vw 2vw rgb(246, 183, 0, 0.25));
  }

.swiper-Picture{
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  object-position: center center;  
}

  .bottomBar{
    position: absolute;
    width: 100%;
    min-height: 0vh;
    max-height: 4.5vh;
    background-color: rgb(0,0,0,0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0vh;
  }

  .smallSlideTitle{
    color: white;
    height: auto;
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 2.15vh;
  }


  .footer{
    position: absolute;
    top: 275vh;
    width: 98.5vw;
    height: 25vh;
    /* outline: 0.25vw solid red; */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footerIcon{
    user-select: none;
    cursor: pointer;
    position: relative;
    bottom: -6vh;
    color: white;
    padding-right: 3vh;
    transition: 0.3s transform ease;
    transition: 0.3s ease;
  }
  .footerIcon:hover{
    transform: scale(1.2);
    color: var(--primary-color);
    filter: drop-shadow(0vw 0vw 0.15vw var(--primary-color));
  }

  .leftTab{
    position: absolute;
    width: 12vw;
    height: 12vh;
    left: 20vh;
    bottom: 10vh;
    /* outline: 0.15vw solid red; */
    text-align: center;
    color: white;
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.25vh;
  }
  .leftTabText{
    cursor: pointer;
    transition: 0.3s ease;
  }
  .leftTabText:hover{
    color: var(--primary-color);
    filter: drop-shadow(0vw 0vw 0.15vw var(--primary-color));
    transform: scale(1.2);
  }

  .footerLogo{
  position: absolute;
    right: 20vh;
    bottom: 18vh;
    z-index: 5;
    height: 5vh;
    width: 15vw;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(../assets/LogoText.png);
    transition: 0.3s ease;
  }
  .footerLogo:hover{
    transform: scale(1.2) rotate(5deg);
    filter: drop-shadow(0vw 0vw 0.25vw var(--primary-color));
  }
  .supportButton{
    position: absolute;
    width: 9vw;
    height: 7vh;
    right: 26vh;
    bottom: 10vh;
    background-color: rgb(30,30,30,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.75vh;
    border-radius: 0.35vw;
    transition: 0.3s ease;
    outline: 0.15vw solid transparent;
  }
  .supportButton:hover{
    background-color: rgb(30,30,30,0.5);
    filter: drop-shadow(0vw 0vw 0.25vw var(--primary-color));
    color: var(--primary-color);
    outline: 0.15vw solid var(--primary-color);
    transform: scale(1.05) translateY(-1vh);
  }

  .joinUsText{
    position: absolute;
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 900;
    font-size: 2.5vw;
    font-style: italic;
    background-color: #ebf928;
    background-image: linear-gradient(315deg, #ebf928 0%, #d425b5 74%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    bottom: 8vh;
    margin-left: -3vh;
    transform: rotate(-10deg);
  }
  </style>
  