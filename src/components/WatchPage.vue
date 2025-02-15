<template>
    <div class="background">
        <div class="lowSide" v-if="isLoaded">
            <div v-if="prevEpisodeAvailable" class="episodeButton prevButton" @click="prevEpisode"><p><font-awesome-icon style="margin-right: 5px;" :icon="['fas', 'angles-left']" /> Episodul anterior</p></div>
            <p class="Title"><span style="color: var(--primary-color); filter: drop-shadow(0 0 5px var(--primary-color)); font-weight: 600; cursor: pointer;" @click="redirect(`/${series[0].url_slug}`)">{{ series[0].title }}</span> <span>{{ episode[0].episode_title }}</span></p>
            <div v-if="nextEpisodeAvailable" class="episodeButton nextButton" @click="nextEpisode"><p>Episodul următor</p> <font-awesome-icon style="margin-left: 5px;" :icon="['fas', 'angles-right']" /></div>
            <div class="episodesList">
                <div class="episodesListButton" @click="openEpisodesList">
                    <font-awesome-icon :class="{'episodesListButton-active': isEpisodesListOpen}" style="margin-right: 5px;" :icon="['fas', 'angles-up']" /><p>Listă episoade</p>
                </div>
                    <div v-if="isShowingSeasons == false"  ref="episodesListContainer" :class="{'episodesListContainer': true, 'episodesListContainer-active': isEpisodesListOpen}">
                        <p v-for="(episodeList, index) in filteredEpisodes" 
                        :key="index" 
                        :id="episodeList.episode_title === episode[0].episode_title ? 'activeEpisode' : null" 
                        :class="{'episodesListEpisode': true,'episodesListEpisode-active': episodeList.episode_title === episode[0].episode_title}" 
                        style="margin-top: -5px;" 
                        @click="redirectEpisode(`/watch/${episodeList.episode_id}`)"
                        >
                            {{ episodeList.episode_title }}
                        </p>
                    </div>
                    <div v-if="isShowingSeasons == true"  ref="episodesListContainer" :class="{'episodesListContainer': true, 'episodesListContainer-active': isEpisodesListOpen}">
                        <p v-for="(season, index) in seasons" 
                        :key="index" 
                        :class="{'episodesListEpisode': true}" 
                        style="margin-top: -5px; font-size: 18px;" 
                        @click="this.currentSeason = season.season; isShowingSeasons = false"
                        >
                            {{ season.title }}
                        </p>
                    </div>
                    <p :class="{'episodesListTitle': true, 'episodesListTitle-active': isEpisodesListOpen}" @click="isShowingSeasons = true">
                        <font-awesome-icon v-if="isShowingSeasons === false" class="episodesListTitleIcon" :icon="['fas', 'arrow-left']" style="position: absolute; margin-right: 140px; transition: 0.3s ease;"/>
                        <span v-if="isShowingSeasons === false">{{ getSeasonName(currentSeason) }}</span>
                        <span v-if="isShowingSeasons === true">{{ getSeasonName(series[0].title) }}</span>
                    </p>
            </div>
            <div class="infoButton">
              <font-awesome-icon :icon="['fas', 'circle-info']" size="xl" />
            </div>
            <div class="infoContainer">
              <p>Dacă Auto-Skip Intro / Auto-Next nu funcționează , înseamnă că acestea nu au fost setate!</p>
              <p>Orice problemă legată de subtitrări/episod se raportează pe serverul nostru de discord</p>
            </div>
            <div class="autoSkipIntro">
              <p class="autoSkipText">Auto-Skip Intro</p>
              <div :class="{'autoSkipButton': true, 'autoSkipButton-active' : autoSkipButton}" @click="toggleSetting('autoSkip')">
                <div :class="{'autoSkipButtonCircle': true, 'autoSkipButtonCircle-active': autoSkipButton}"></div>
              </div>
            </div>
            <div class="autoSkipIntro" style="position: absolute; left: 90px;bottom: 0; width: 200px;">
              <p class="autoSkipText" style="margin-left: -8px;">Auto Next-Episode</p>
              <div :class="{'autoSkipButton': true, 'autoSkipButton-active' : autoNextButton}" @click="toggleSetting('autoNext')">
                <div :class="{'autoSkipButtonCircle': true, 'autoSkipButtonCircle-active': autoNextButton}"></div>
              </div>
            </div>
            <div class="autoSkipIntro" style="position: absolute; left: 190px;bottom: 0; width: 200px;">
              <p class="autoSkipText" style="margin-left: -8px;">Auto Play-Episode</p>
              <div :class="{'autoSkipButton': true, 'autoSkipButton-active' : autoPlayButton}" @click="toggleSetting('autoPlay')">
                <div :class="{'autoSkipButtonCircle': true, 'autoSkipButtonCircle-active': autoPlayButton}"></div>
              </div>
            </div>
        </div>
        <div class="playerContainer">
          <iframe 
            class="player" 
            ref="videoIframe" 
            :src="videoSrc" 
            loading="lazy" 
            width="100%" 
            height="100%" 
            frameborder="0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen="true"
          ></iframe>
        </div>
    </div>
  </template>
  <script>
import router from '@/router';
import playerjs from 'player.js'

  export default {
    data(){
    return{
        userName: '',
        isLoggedIn: false,
        isLoaded: false,
        episode: [],
        series: [],
        episodes: [],
        seasons: [],
        chapters: [],
        episodeLength: 0,
        continueWatching: [],
        currentSeason: '',
        videoSrc: '',
        player: null,
        intervalId: null,
        isEpisodesListOpen: false,
        nextEpisodeAvailable: true,
        prevEpisodeAvailable: true,
        isShowingSeasons: false,
        autoSkipButton: false,
        autoNextButton: false,
        autoPlayButton: false,
        currentTimeSeconds: 0,
        savedContinueWatching: false,
    }
    },
    async mounted(){
      const authToken = localStorage.getItem('authToken');
          if (authToken) {
            try {
              const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/isLoggedIn`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              const userData = await response.json();
              if(userData){
                this.userName = userData.username
                this.isLoggedIn = true
              }
            } catch (error) {
              console.error('Automatic login failed:', error);
              localStorage.removeItem('authToken');
            }
        }
        const episodeID = this.$route.params.episode;
        if(localStorage.getItem('autoSkip') === 'true'){this.autoSkipButton = true}
        if(localStorage.getItem('autoNext') === 'true'){this.autoNextButton = true}
        if(localStorage.getItem('autoPlay') === 'true'){this.autoPlayButton = true}
        if(!isNaN(parseFloat(episodeID)) && isFinite(episodeID)){
            try{
                const username = this.userName
                const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadEpisode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ episodeID, username })
                });
                if (response.ok) {
                const data = await response.json();
                this.episode = data.episodeData
                this.series = data.seriesData
                this.episodes = data.episodesData
                this.continueWatching = data.continueWatchingData
                const seasons = JSON.parse(this.series[0].seasons);
                this.seasons = Object.entries(seasons).map(([title, season]) => ({ title, season }));
                this.currentSeason = this.episode[0].episode_season
                this.$nextTick(() => {
                this.isLoaded = true;
                this.executeFunctionAfterIframeLoad();
                const currentEpisodeId = this.episode[0].episode_id;
                const prevEpisode = this.episodes.slice().reverse().find(episode => episode.series_slug === this.episode[0].series_slug && episode.episode_id < currentEpisodeId);
                const nextEpisode = this.episodes.find(episode => episode.series_slug === this.episode[0].series_slug && episode.episode_id > currentEpisodeId);
                if (!nextEpisode) {
                    this.nextEpisodeAvailable = false;
                }else if(!prevEpisode){
                    this.prevEpisodeAvailable = false;
                }
                });
                }
            } catch(error){
                console.error('Error fetching data:', error);
            }
        }
    },
    methods: {
        getId(videoId) {
        return videoId
        },
        executeFunctionAfterIframeLoad() {
          this.videoSrc = this.episode[0].video_url
          this.$nextTick(() => {
              const player = new playerjs.Player(this.$refs.videoIframe);
              var currentTimeSet = false;
              var doNotSkip = false
              function timeStringToSeconds(timeString) {
                  const [hours, minutes, seconds] = timeString.split(':').map(Number);
                  return hours * 3600 + minutes * 60 + seconds;
              }
              player.on('ready', () => {
                if(this.autoPlayButton){
                  player.play();
                }
                if(this.episode[0].outro){
                  const outro = JSON.parse(this.episode[0].outro);
                  const outroStart = timeStringToSeconds(outro.start);
                  const outroEnd = timeStringToSeconds(outro.end);

                  if (this.continueWatching.length > 0 && !currentTimeSet) {
                      const continueTimeSeconds = this.continueWatching[0].continue_time;
                      if (continueTimeSeconds < outroStart || continueTimeSeconds > outroEnd) {
                          player.setCurrentTime(this.continueWatching[0].continue_time);
                          currentTimeSet = true;
                      }else{
                        player.setCurrentTime(this.continueWatching[0].continue_time);
                        currentTimeSet = true;
                        doNotSkip = true;
                      }
                  }
                }else{
                  if (this.continueWatching.length > 0 && !currentTimeSet) {
                    player.setCurrentTime(this.continueWatching[0].continue_time);
                    currentTimeSet = true;
                  }
                }
              });

              player.on('timeupdate', (currentTime) => {
                  this.currentTimeSeconds = currentTime.seconds
                  this.episodeLength = currentTime.duration
                  if(this.autoSkipButton){
                    if(this.episode[0].intro){
                      const intro = JSON.parse(this.episode[0].intro)
                      const introStart = timeStringToSeconds(intro.start);
                      const introEnd = timeStringToSeconds(intro.end);
                      const roundedSeconds = Math.round(currentTime.seconds)
                        if(roundedSeconds > introStart && roundedSeconds < introEnd){
                          player.setCurrentTime(introEnd);
                        }
                    }
                  }
                  if(this.autoNextButton){
                    if(this.episode[0].outro){
                      const outro = JSON.parse(this.episode[0].outro)
                      const outroStart = timeStringToSeconds(outro.start);
                      const outroEnd = timeStringToSeconds(outro.end);
                      const roundedSeconds = Math.round(currentTime.seconds)
                      if(roundedSeconds > outroStart && roundedSeconds < outroEnd && !doNotSkip){
                        this.nextEpisode();
                      }
                    }
                  }
              });
          });
      },
        openEpisodesList(){
            this.isEpisodesListOpen = !this.isEpisodesListOpen
            const activeEpisodeElement = document.getElementById('activeEpisode');
            if (activeEpisodeElement) {
                activeEpisodeElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
        getSeasonName(seasonValue) {
            const seasons = JSON.parse(this.series[0].seasons)
            for (const [key, value] of Object.entries(seasons)) {
                if (value === seasonValue) {
                return key;
                }
            }
            return seasonValue;
        },
        redirect(url){
            router.push(url);
        },
        redirectEpisode(url){
            setTimeout(() => {
                router.push(url);
                setTimeout(() => {
                    window.location.reload();
                }, 1); // Reload after 1 second
            }, 1); // Push router after 1 second
        },
        nextEpisode() {
            const currentEpisodeId = this.episode[0].episode_id;
            const nextEpisode = this.episodes.find(episode => episode.episode_id > currentEpisodeId);
            if (nextEpisode) {
                this.redirectEpisode(`/watch/${nextEpisode.episode_id}`);
            }
        },
        prevEpisode() {
            const currentEpisodeId = this.episode[0].episode_id;
            const previousEpisode = this.episodes.slice().reverse().find(episode => episode.episode_id < currentEpisodeId);
            if (previousEpisode) {
                this.redirectEpisode(`/watch/${previousEpisode.episode_id}`);
            }
        },
        toggleSetting(value){
          if(value === 'autoSkip'){
            this.autoSkipButton = !this.autoSkipButton
            localStorage.setItem('autoSkip', this.autoSkipButton);
          }if(value === 'autoNext'){
            this.autoNextButton = !this.autoNextButton
            localStorage.setItem('autoNext', this.autoNextButton);
          }if (value === 'autoPlay'){
            this.autoPlayButton = !this.autoPlayButton
            localStorage.setItem('autoPlay', this.autoPlayButton);
          }
        },
    },
    beforeUnmount() {
        if(this.currentTimeSeconds > 5 && !this.savedContinueWatching){
          fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadEpisode/saveContinueWatching`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              episodeId: this.episode[0].episode_id,
              video_thumbnail: this.episode[0].video_thumbnail,
              episode_title: this.episode[0].episode_title,
              series_slug: this.series[0].url_slug,
              username: this.userName,
              currentTimeSeconds: this.currentTimeSeconds,
              episode_length: this.episodeLength
            }),
          })
          .then(response => {
            if (response.ok) {
              this.currentTimeSeconds = 0
              this.savedContinueWatching = true
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .catch(error => {
            console.error('Error saving continue watching:', error);
          });
        }
      clearInterval(this.intervalId);
  },
  computed: {
    filteredEpisodes() {
      // Filter the episodes array based on episode_season
      return this.episodes.filter(episode => episode.episode_season === this.currentSeason);
    }
  },
  created(){
    const vm = this;
    window.addEventListener('beforeunload', function() {
      if(vm.currentTimeSeconds > 5 && !vm.savedContinueWatching){
          fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadEpisode/saveContinueWatching`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              episodeId: vm.episode[0].episode_id,
              video_thumbnail: vm.episode[0].video_thumbnail,
              episode_title: vm.episode[0].episode_title,
              series_slug: vm.series[0].url_slug,
              username: vm.userName,
              currentTimeSeconds: vm.currentTimeSeconds,
              episode_length: vm.episodeLength
            }),
          })
          .then(response => {
            if (response.ok) {
              vm.currentTimeSeconds = 0
              vm.savedContinueWatching = true
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .catch(error => {
            console.error('Error saving continue watching:', error);
          });
        }
    });
  }
  };
  </script>
  
  <style scoped>

  .background{
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
  /* Add your CSS styles for player container and progress bar here */
  .playerContainer{
    position: absolute;
    left: -10px;
    top: 50px;
    width: 100.5%;
    height: 86.5%;
    border-bottom: 1px solid rgb(255,255,255,.1);
  }


  .lowSide{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .Title{
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 20px;
  }
  .episodeButton{
    user-select: none;
    margin-right: 10px;
    margin-left: 10px;
    width: 160px;
    height: 40px;
    background-color: rgb(30,30,30,.5);
    outline: 1px solid rgb(255,255,255,.2);
    border-radius: 4.65px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease;
  }
  .episodeButton:hover{
    outline: 1 px solid var(--primary-color);
    filter:drop-shadow(0 0 3px var(--primary-color));
    color: var(--primary-color);
  }
  .prevButton:hover{
    transform: translateX(-5px);
  }
  .nextButton:hover{
    transform: translateX(5px);
  }

  .episodesList{
    position: absolute;
    right: 50px;
    bottom: 15px;
    display: flex;
    flex-direction: column-reverse;
    transition: 0.3s ease;
  }
  .episodesListButton{
    user-select: none;
    width: 220px;
    height: 40px;
    background-color: rgb(30,30,30);
    border: 1px solid rgb(255,255,255,.2);
    border-radius: 4.65px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease;
  }
  .episodesList:hover{
    border: 1 px solid var(--primary-color);
    transform: translateY(-5px);
  }
  .episodesListButton:hover{
    color: var(--primary-color);
    background-color: rgb(30,30,30,.5);
    filter:drop-shadow(0 0 3px var(--primary-color));
  }

  .episodesListContainer{
    position: relative;
    bottom: 0;
    right: 0;
    width: 220px;
    height: 0;
    max-height: 400px;
    z-index: 100;
    background-color: rgb(30,30,30);
    display: flex;
    align-items: center;
    flex-direction: column;
    clip-path: inset(100% 0 0 0);
    border-left: 1px solid rgb(255,255,255,.2);
    border-right: 1px solid rgb(255,255,255,.2);
    border-top-left-radius: 4.65px;
    border-top-right-radius: 4.65px;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    overflow-y: scroll;
    transition: 0.3s ease;
  }

  .episodesListContainer-active{
    height: auto;
    clip-path: inset(0 0 0 0);
  }

  .episodesListButton-active{
    transition: 0.3s ease;
    transform: rotate(-180deg);
  }

  .episodesListTitle{
    clip-path: inset(100% 0 0 0);
    transition: 0.3s ease;
    font-family: 'Roboto', sans-serif;
    bottom: 100px;
    z-index: 1000;
    background-color: rgb(30,30,30);
    width: 222px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    text-align: center; 
    border: 1px solid rgb(255,255,255,.1);
    margin-bottom: -4px;
    color: var(--primary-color); 
    height: 0;
    text-shadow: 0 0 75px var(--primary-color);
    cursor: pointer;
  }
  .episodesListEpisode{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    width: auto;
    height: auto;
    text-align: center; 
    border-bottom: 1px solid rgb(255,255,255,.1); 
    padding: 15px;
    color: white; 
    transition: 0.3s ease;
    cursor: pointer;
  }


  .episodesListTitle:hover{
    background-color: rgb(60,60,60);
  }
  .episodesListTitle:hover .episodesListTitleIcon{
    transform: translateX(-7px);
  }

  .episodesListTitle-active{
    height: 50px;
    clip-path: inset(0 0 0 0);
  }
  .episodesListEpisode-active{
    color: var(--primary-color);
    filter: drop-shadow(0 0 5px var(--primary-color));
  }
  .episodesListEpisode:hover{
    color: var(--primary-color);
    filter: drop-shadow(0 0 5px var(--primary-color));
  }
  

  .infoButton{
    cursor: pointer;
    color: var(--primary-color);
    filter: drop-shadow(0 0 15px var(--primary-color));
    position: absolute;
    left: 50px;
    bottom: 22.5px;
  }

  .infoContainer{
    user-select: none;
    pointer-events: none;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 11.5px;
    position: absolute;
    left: 80px;
    border-radius: 4.65px;
    width: 475px;
    height: 67.5px;
    text-align: center;
    clip-path: inset(0 100% 0 0);
    background-color: rgb(40,40,40);
    transition: 0.3s ease;
    z-index: 10;
  }

  .infoButton:hover +.infoContainer{
    clip-path: inset(0 0 0 0);
  }
  .autoSkipText{
    position: absolute;
    left: 86px;
    bottom: -5px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 10.5px;
    color: white;
  }
  .autoSkipButton{
    position: absolute;
    left: 100px;
    bottom: 22.5px;
    width: 45px;
    height: 25px;
    background-color: transparent;
    outline: 1px solid rgb(255,255,255,.2);
    border-radius: 250px;
    transition: 0.3s ease;
    cursor: pointer;
  }

  .autoSkipButton-active{
    background-color: rgb(246, 183, 0, .6);
    filter: drop-shadow(0 0 5px var(--primary-color));
  }
  .autoSkipButtonCircle{
    position: relative;
    left: 2px;
    top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: white;
    transition: 0.3s ease;
  }

  .autoSkipButtonCircle-active{
    transform: translateX(20px);
  }



  </style>