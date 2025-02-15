<template>
  <div class="background">
    <div class="wrapper">
      <p class="title">Filme <span style="color: var(--primary-color); filter: drop-shadow(0 0 3px var(--primary-color))">Animekai</span></p>
      
      <p class="no-movies-title">Momentan echipa Animekai este prea ocupată cu seriile Anime și nu avem timp pentru postarea filmelor. <br> În viitorul apropiat o să adăguam și filme!</p>

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
</template>

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

.no-movies-title{
  position: absolute;
  top: 150px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 35px;
  text-align: center;
  color: white;
}


.footer{
    position: absolute;
    bottom: 0px;
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