<template>
  <div class="background">
    <div class="wrapper">
      <p class="title">Seriale <span style="color: var(--primary-color); filter: drop-shadow(0 0 3px var(--primary-color))">Animekai</span></p>
      <div class="genre-buttons">
        <div class="genre-button" v-for="(button, index) in buttons" :key="index" :class="{'genre-button-active': activeButton === button.type}" @click="activeButton = button.type">
          <p class="genre-type">{{ button.type }}</p>
        </div>
      </div>

      <div class="series-container">
        <div class="series" v-for="(series, index) in filteredSeries" :key="index" @click="redirect(`/${series.url_slug}`)">
          <div class="series-image-container">
            <img class="series-image" :src="getHeaderImage(series.header_photo)" loading="lazy">
            <div class="series-title-container">
              <p class="series-title">{{ series.title }}</p>
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
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
export default {
  data(){
    return{
      buttons: [
        { type: 'Toate' },
        { type: 'Acțiune' },
        { type: 'Aventură' },
        { type: 'Dramă' },
        { type: 'Fantezie' },
        { type: 'Comedie' },
        { type: 'Sci-Fi' }
      ],
      activeButton: 'Toate',
      series: [],
    }
  },
  methods: {
    redirect(url){
      router.push(url)
    },
    getHeaderImage(url) {
            const contentPhoto = `${url}.jpg`;
            let imageUrl;

            try {
                imageUrl = require(`@/assets/headerPhotos/${contentPhoto}`);
            } catch (error) {
                imageUrl = require(`@/assets/headerPhotos/photoInexistent-headerPhoto.jpg`);
            }

            return imageUrl;
      },
  },
  async mounted(){
    const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadSeriesPage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const data = await response.json();
      this.series = data.series
    }
  },
  computed: {
    filteredSeries() {
      if (this.series) {
        if (this.activeButton === 'Toate') {
          return this.series;
        } else {
          // Filter series based on the active button
          return this.series.filter(series => series.genre.includes(this.activeButton));
        }
      } else {
        return null;
      }
    }
  }

}
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
.wrapper{
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
.title{
  position: absolute;
  top: 0px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-style: italic;
  font-size: 60px;
  color: white;
}

.genre-buttons{
  position: absolute;
  top: 140px;
  width: 450px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7.5px;
}

.genre-button{
  width: 100px;
  height: 40px;
  background-color: rgb(50,50,50, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: white;
  border-radius: 4.65px;
  user-select: none;
  transition: 0.3s ease;
  cursor: pointer;
}

.genre-button:hover{
  transform: scale(1.05);
  background-color: rgb(50,50,50, .9);
  filter: drop-shadow(0 0 3px var(--primary-color));
  color: var(--primary-color);
}


.genre-button-active{
  background-color: rgb(50,50,50, .9);
  filter: drop-shadow(0 0 3px white);
  color: white;
}

.series-container{
  position: absolute;
  top: 30%;
  width: 95%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.series{
  position: relative;
  border-radius: 4.65px;
  cursor: pointer;
}


.series-image-container {
  width: 375px;
  height: 240px;
  position: relative; /* Make the container relatively positioned */
  border-radius: 4.65px;
  transition: 0.3s ease;
  outline: 2px solid transparent;
}

.series-image-container:hover{
  transform: scale(1.075);
  outline: 2px solid var(--primary-color);
  filter: drop-shadow(0 0 3px var(--primary-color))
}
.series-image{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  border-radius: 4.65px;
}
.series-title-container{
  position: absolute; /* Make the container relatively positioned */
  bottom: 0;
  background-color: rgb(20,20,20,.9);
  width: 100%;
  height: 55px; /* Normal height */
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 21px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.footer{
    position: absolute;
    bottom: -300px;
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