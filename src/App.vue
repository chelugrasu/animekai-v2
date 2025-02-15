<template>
  <div id="app">
    <div class="header" v-if="shouldShowHeader">
    <div class="logo"></div>
    <div :class='{headerButton: true, activeHeaderButton: activeHeaderButtonIndex === 0}' @click="redirectHeader('/home', 0)"   style="left: 23vh;"><font-awesome-icon class="headerButtonIcon" style="color: white;" :icon="['fas', 'house']" /><p>Acasă</p></div>
    <div :class='{headerButton: true, activeHeaderButton: activeHeaderButtonIndex === 1}' @click="redirectHeader('/series', 1)" style="left: 34vh; top: 0vh;" id="seriesButton"><font-awesome-icon class="headerButtonIcon" style="color: white;" :icon="['fas', 'desktop']" /><p>Seriale</p></div>
    <div :class='{headerButton: true, activeHeaderButton: activeHeaderButtonIndex === 2}' @click="redirectHeader('/movies', 2)" style="left: 45vh;" id="moviesButton"><font-awesome-icon class="headerButtonIcon" style="color: white;" :icon="['fas', 'film']" /><p>Filme</p></div>
    <div class="loggedInCategory" v-show="isLoggedIn">
      <div class='optionsButton' @click="toggleOptionsContainer()">
        <!-- <font-awesome-icon class="optionsButtonIcon" :icon="['fas', 'circle-user']" /> -->
        <img v-if="isLoggedIn" class="optionsButtonIcon" :src="getProfilePicture(profilePicture)" loading="lazy">
        <p v-if="isLoggedIn" class="optionsButtonText" v-text="userName"></p>
        <font-awesome-icon style="color: white; height: 1.35vh; margin-left: 0.75vh; margin-top: -0.2vh;" :icon="['fas', 'chevron-down']"/>
      </div>
      <div class="optionsContainer" :class="{ 'optionsContainer-active': isActive }">
        <div class="optionButton" style="top: 0.5vh;" @click="redirect(`/member/${toLowerCaseValue(userName)}`)">
          <font-awesome-icon class="optionButtonIcon" :icon="['fas', 'user']" size="sm"/>
          <div class="optionButtonDot"></div>
          <p class="optionButtonText">Profilul meu</p>
        </div>
        <div class="optionButton" style="top: 5vh;" @click="redirect(`/member/${toLowerCaseValue(userName)}/?continue_watching`)">
          <font-awesome-icon class="optionButtonIcon" :icon="['fas', 'play']" size="sm"/>
          <div class="optionButtonDot"></div>
          <p class="optionButtonText">Continuăți vizionarea</p>
        </div>
        <div class="optionButton" style="top: 9.5vh;" @click="redirect(`/member/${toLowerCaseValue(userName)}/?edit_profile`)">
          <font-awesome-icon class="optionButtonIcon" :icon="['fas', 'pen-to-square']" size="sm"/>
          <div class="optionButtonDot"></div>
          <p class="optionButtonText">Editează profilul</p>
        </div>
        <div class="optionButton" style="top: 14vh;" @click="logOut()">
          <font-awesome-icon class="optionButtonIcon" :icon="['fas', 'right-from-bracket']" size="sm"/>
          <div class="optionButtonDot"></div>
          <p class="optionButtonText">Deconectează-te</p>
        </div>
      </div>
    </div>
    <router-link to="/login">
      <div class="logInButton" v-show="!isLoggedIn">
        <p>Conectează-te</p>
    </div>
    </router-link>
  </div>
    <router-view></router-view>
  </div>
</template>

<script>
import router from './router';

export default {
  name: 'App',
  data(){
    return{
      isActive: false,
      isLoggedIn: false,
      userName: '',
      profilePicture: '',
      activeHeaderButtonIndex: null
    }
  },
  computed: {
    shouldShowHeader() {
      // Check if the route path is not equal to the paths where you want to hide the header
      return !['/', '/login', '/register', '/verify', '/forgot-password', '/upload-files', '/reset-password', '/change-email'].includes(this.$route.path);
    }
  },
  provide() {
    return {
      checkUserToken: this.checkUserToken,
      setActiveHeaderButtonIndex: this.setActiveHeaderButtonIndex
    };
  },
  mounted() {
    // Call your function here
    this.checkUserToken();
    const url = window.location.href
      if(url.includes('/home')){
        this.activeHeaderButtonIndex = 0
      }else if(url.includes('/series')){
        this.activeHeaderButtonIndex = 1
      }else if(url.includes('/movies')){
        this.activeHeaderButtonIndex = 2
      }
  },
  methods: {
    async checkUserToken() {
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
            this.profilePicture = userData.profile_picture
          }else(
            this.isLoggedIn = false
          )
        } catch (error) {
          console.error('Automatic login failed:', error);
          // localStorage.removeItem('authToken');
        }
      }
    },
    toggleOptionsContainer(){
      this.isActive = !this.isActive
    },
    logOut(){
      localStorage.removeItem('authToken');
      window.location.reload();
    },
    toLowerCaseValue(value){
      return value.toLowerCase();
    },
    redirect(location){
      this.toggleOptionsContainer()
      setTimeout(() => {
          router.push(location);
            setTimeout(() => {
              window.location.reload();
            }, 1); // Reload after 1 second
        }, 1); // Push router after 1 second
    },
    redirectHeader(location, index){
      this.setActiveHeaderButtonIndex(index)
      router.push(location)
    },
    setActiveHeaderButtonIndex(index){
      this.activeHeaderButtonIndex = index
    },
    getProfilePicture(pictureId){
        if(this.isLoggedIn){
          const profilePicture = `${pictureId}.png`;
          let imageUrl;

          try {
            imageUrl = require(`@/assets/profilePhotos/${profilePicture}`);
          } catch (error) {
            imageUrl = require(`@/assets/profilePhotos/photoInexistent-profilePhoto.png`);
          }

          return imageUrl;
        }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
:root {
  --primary-color: #F6B700;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 0.35vw;
}

/* Track */
::-webkit-scrollbar-track {
    background-color: #141414;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--primary-color); 
}


body{
  background-color: transparent;
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
    background-image: url(./assets/LogoText.png);
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

.activeHeaderButton{
  filter: drop-shadow(0vh 0vh 0.05vh rgba(246, 183, 0, 0.75));
  border-top: 0.25vw solid var(--primary-color);
}

.headerButtonIcon{
  position: relative;
  left: -0.5vh;
  top: -0.15vh;
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
  border-radius: 1000px;
  object-fit: contain;
  object-position: center center;
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
</style>