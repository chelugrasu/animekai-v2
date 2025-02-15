<template>
    <!-- <router-link to='/home'>
        <button>Home</button>
    </router-link> -->
    <div class="BackgroundOverlay">
        <div class="UIBackground"></div>
    </div>
    <router-link to="/home">
        <div class="LogoText"></div>
    </router-link>
    
    <router-link to="/login">
        <div class="loginButton">Conectează-te</div>
    </router-link>
    <router-link to="/register">
        <div class="registerButton">Înregistrează-te</div>
    </router-link>
    <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="slide-content">
            <h2 class="Title">Tokyo Ghoul</h2>
            <p class="Description">Un student din Tokyo, Ken Kaneki, se transformă în jumătate Ghoul după un eveniment fatal. Înțepenit între lumea umană și cea a Ghoul-ilor, Ken se confruntă cu dileme de identitate și moralitate într-o lume plină de conflicte și pericole.</p>
            <div class="watchButton" @click="watchSlide('TokyoGhoul')">Vizionează</div>
            <div class="learnMoreButton" @click="learnMore('TokyoGhoul')">Află mai Mult</div>
            <img class="slidePhoto" id="slidePhotoTokyoGhoul" src="../assets/tokyoGhoul.png" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            <div class="currentSlide">
                <div class="Dot" id="activeDot"></div>
                <div class="Dot" id="inactiveDot"></div>
                <div class="Dot" id="inactiveDot"></div>
            </div>
            <div class="SlideButton" id="previousSlideButton" @click="slidePrevPage"><font-awesome-icon class="arrowLeftIcon" :icon="['fas', 'chevron-left']" /></div>
            <div class="SlideButton" id="nextSlideButton" @click="slideNextPage"><font-awesome-icon class="arrowRightIcon" :icon="['fas', 'chevron-right']" /></div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="slide-content">
            <h2 class="Title">Solo Leveling</h2>
            <p class="Description">Un luptător singuratic, Sung Jin-Woo, își îmbunătățește abilitățile într-o lume plină de monștri. În căutarea puterii, el descoperă secretele universului și propriile sale transformări, într-o poveste plină de pericole și evoluție personală.</p>
            <div class="watchButton" @click="watchSlide('SoloLeveling')">Vizionează</div>
            <div class="learnMoreButton" @click="learnMore('SoloLeveling')">Află mai Mult</div>
            <img class="slidePhoto" id="slidePhotoSoloLeveling" src="../assets/SoloLeveling.png" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            <div class="currentSlide">
                <div class="Dot" id="inactiveDot"></div>
                <div class="Dot" id="activeDot"></div>
                <div class="Dot" id="inactiveDot"></div>
            </div>
            <div class="SlideButton" id="previousSlideButton" @click="slidePrevPage"><font-awesome-icon class="arrowLeftIcon" :icon="['fas', 'chevron-left']" /></div>
            <div class="SlideButton" id="nextSlideButton" @click="slideNextPage"><font-awesome-icon class="arrowRightIcon" :icon="['fas', 'chevron-right']" /></div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="slide-content">
            <h2 class="Title">Demon Slayer</h2>
            <p class="Description">Un tânăr vânător de demoni, Tanjiro Kamado, își urmărește scopul de a-și vindeca sora și de a răzbuna familia, ucisă de demoni. În călătoria sa plină de pericole, el descoperă prietenii puternice și se confruntă cu forțe întunecate, devenind o speranță pentru o lume amenințată de rău.</p>
            <div class="watchButton" @click="watchSlide('DemonSlayer')">Vizionează</div>
            <div class="learnMoreButton" @click="learnMore('DemonSlayer')">Află mai Mult</div>
            <img class="slidePhoto" id="slideDemonSlayer" src="../assets/DemonSlayer.png" loading="lazy">
            <div class="swiper-lazy-preloader"></div>
            <div class="currentSlide">
                <div class="Dot" id="inactiveDot"></div>
                <div class="Dot" id="inactiveDot"></div>
                <div class="Dot" id="activeDot"></div>
            </div>
            <div class="SlideButton" id="previousSlideButton" @click="slidePrevPage"><font-awesome-icon class="arrowLeftIcon" :icon="['fas', 'chevron-left']" /></div>
            <div class="SlideButton" id="nextSlideButton" @click="slideNextPage"><font-awesome-icon class="arrowRightIcon" :icon="['fas', 'chevron-right']" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.swiper-container { 
  width: 100%;
  height: 98.3vh; /* Adjust to fit your needs */
  overflow: hidden;
  overflow-x: hidden;
}

.swiper-slide {
    width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.BackgroundOverlay{
position: absolute;
  height: 100.05vh;
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
.UIBackground{
    position: absolute;
  height: 100.1vh;
  top: -0.05vh;
  left: 0vh;
  width: 100%;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(../assets/tokyoGhoulBackground.jpg);
  background-color: black;
  filter: blur(1vh);
}

.LogoText{
    position: absolute;
    top: 2.5vh;
    left: 0vh;
    z-index: 5;
    height: 2.5vh;
    width: 22.5vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(../assets/LogoText.png);
}
.loginButton{
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 1.5vh;
    color: white;
    position: absolute;
    top: 2.5vh;
    right: 3vh;
    width: 15vh;
    height: 5vh;
    border-radius: 0.05vh;
    transform: skew(-8deg);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.25);
    outline: 0.25vh solid white;
    transition: 0.35s;
    z-index: 10;
}
.loginButton:hover{
    color: var(--primary-color);
    outline: 0.25vh solid var(--primary-color);
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
}

.registerButton{
  user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 1.5vh;
    color: white;
    position: absolute;
    top: 2.5vh;
    right: 19.25vh;
    width: 15vh;
    height: 5vh;
    border-radius: 0.05vh;
    transform: skew(-8deg);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.25);
    outline: 0.25vh solid white;
    transition: 0.35s;
    z-index: 10;
}
.registerButton:hover{
    color: var(--primary-color);
    outline: 0.25vh solid var(--primary-color);
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
}


.Title{
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    letter-spacing: 0.25vh;
    font-size: 7vh;
    color: white;
    position: absolute;
    top: 20vh;
    left: 15vh; 
}
.Description{
  user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1.75vh;
    color: white;
    max-width: 62.5vh;
    letter-spacing: 0.15vh;
    line-height: 3vh;
    position: absolute;
    text-align: justify;
    top: 36vh;
    left: 15vh;
}
.watchButton{
  user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 2vh;
    color: white;
    position: absolute;
    top: 55vh;
    left: 15vh;
    width: 20vh;
    height: 6vh;
    background-color: rgba(29,29,29,1);
    border-radius: 0.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.35s;
    outline: 0.25vh solid transparent;
}
.watchButton:hover{
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    outline: 0.25vh solid var(--primary-color);
    background-color: rgba(29,29,29,0.25);
    color: var(--primary-color);
}

.learnMoreButton{
  user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 2vh;
    color: white;
    position: absolute;
    top: 55vh;
    left: 37.5vh;
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
.learnMoreButton:hover{
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    outline: 0.25vh solid var(--primary-color);
    color: var(--primary-color);
}

.slidePhoto{
    position: absolute;
    top: 0vh;
    width: 100%;
    height: 100%;
    right: -35vh;
    background-repeat: no-repeat;
}

#slidePhotoTokyoGhoul{
    object-fit: contain;
    object-position: center center;
    filter: drop-shadow(0vh 0vh 15vh rgba(110, 38, 14, 1));
    background-size: 100%;
}
#slidePhotoSoloLeveling{
    object-fit: contain;
    object-position: center center;
    filter: drop-shadow(0vh 0vh 15vh rgb(0, 174, 255));
}
#slidePhotoDemonSlayer{
    filter: drop-shadow(0vh 0vh 15vh var(--primary-color));
    object-fit: contain;
    object-position: center center;
  
}
.SlideButton{
    position: absolute;
    width: 8.5vh;
    height: 8.5vh;
    top: 66.5vh;
    background-color: rgba(29,29,29,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10vh;
    cursor: pointer;
    transition: 0.35s;

}
.SlideButton:hover{
    background-color: rgb(80, 80, 80);
}

#previousSlideButton{
    left: 15vh;
}
.arrowLeftIcon{
    color: white;
    width: 3vh;
    height: 3vh;
}

#nextSlideButton{
    left: 25vh;
}
.arrowRightIcon{
    color: white;
    width: 3vh;
    height: 3vh;
}
.currentSlide{
    flex: 0vh 0vh auto;
    display: inline-block;
    position: absolute;
    margin: 1vh;
    top: 75vh;
    left: 18vh;
    display: inline-block;
}
.Dot{
    width: 1.75vh;
    height: 1.75vh;
    border-radius: 10vh;
    outline: 0.25vh solid gray;
    float: left;
    margin: 0.75vh;
}
#activeDot{
    background-color: gray;
}
#inactiveDot{
    background-color: transparent;
}

</style>

<script>
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'; // Import Swiper styles

export default {
  data() {
    return {
      swiper: null, // Initialize swiper instance property
      autoplayInterval: null // Initialize autoplay interval property
    };
  },
  mounted() {
    // Initialize Swiper
    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal', // Set the direction to horizontal
      slidesPerView: 1, // Show only one slide at a time
      spaceBetween: 0, // No space between slides
      loop: true,
    });

    // Start autoplay
    this.startAutoplay();
  },
  methods: {
    slideNextPage() {
      if (this.swiper) {
        this.swiper.slideNext();
      }
    },
    slidePrevPage() {
      if (this.swiper) {
        this.swiper.slidePrev();
      }
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.slideNextPage();
      }, 5000); // Change the interval duration as needed
    },
    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    }
  },
  beforeUnmount() {
    // Clean up - Stop autoplay before the component is destroyed
    this.stopAutoplay();
  }
};
</script>