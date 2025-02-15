<template>
        <div class="BackgroundOverlay">
        <div class="UIBackground"></div>
    </div>
    <div class="RegisterBox">
        <div class="Title">Înregistrează-te</div>
        <div class="username" :class="{'animate-error': animateUsername}">
            <input class="Input" minlength="3" maxlength="20" v-model="formData.usernameValue" @blur="checkInput1" @keydown="nameKeydown($event)"/>
            <label class="inputText" :class="{ 'has-value': hasValue1 }">Username</label>
        </div>
        <div class="errorDetails" style="top: 33vh;" v-show="showUsernameErrorDetails">
          <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
          <div class="errorDetailsBox" style="width: 13vh;">
            <div class="detail" v-text="usernameErrorText"></div>
          </div>
        </div>
        <div class="email" :class="{'animate-error': animateEmail}">
            <input class="Input" type="email" v-model="formData.emailValue" @blur="checkInput2" />
            <label class="inputText" id="emailInputText" :class="{ 'has-value': hasValue2 }">Email</label>
        </div>
        <div class="errorDetails" style="top: 43vh;" v-show="showEmailErrorDetails">
          <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
          <div class="errorDetailsBox" style="width: 24vh;">
            <div class="detail" v-text="emailErrorText"></div>
          </div>
        </div>
        <div class="password" :class="{'animate-error': animatePassword}">
            <input class="Input" v-bind:type="inputType" v-model="formData.passwordValue" @blur="checkInput3" />
            <label class="inputText" :class="{ 'has-value': hasValue3 }">Password</label>
            <font-awesome-icon class="showPasswordIcon" v-show="showPassword" :icon="['fas', 'eye-slash']" @click="togglePasswordDisplay(true)"/>
            <font-awesome-icon class="showPasswordIcon" v-show="hidePassword" :icon="['fas', 'eye']" @click="togglePasswordDisplay(false)"/>
        </div>
        <div class="errorDetails" style="top: 53vh; right: 18.5vh;" v-show="showPasswordErrorDetails">
          <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
          <div class="errorDetailsBox" style="width: 26vh;">
            <div class="detail">Minim 8 caractere, cu o majusculă și o cifră.</div>
          </div>
        </div>
        <div :class="{'checkBox': true, 'animate-error2': animateTerms}" @click="this.formData.checkBox = !this.formData.checkBox">
            <div class="check" v-show="formData.checkBox"></div>
            <div class="checkBoxText">Accept <router-link to="/terms"><span style="text-decoration: 1px solid white; color: var(--primary-color);">termenii și condițiile</span></router-link></div>
        </div>
        <router-link to="/login">
          <div class="loginText">Ai deja un cont?</div>
        </router-link>
        <div class="registerButton" @click="register()">
            <div class="registerText">ÎNREGISTRARE</div>
        </div>
        <div class="optionsText">sau conectează-te folosind</div>
        <div class="options">
          <div class="connectDiscord" @click="connectDiscord()">
            <font-awesome-icon class="connectDiscordIcon" :icon="['fab', 'discord']" />
          </div>
        </div>
    </div>
</template>

<script>
import router from '../router/index.js';
export default {
  data() {
    return {
        formData: {
            usernameValue: '',
            emailValue: '',
            passwordValue: '',
            checkBox: false,
        },
      hasValue1: false,
      hasValue2: false,
      hasValue3: false,
      inputType: 'password',
      showPassword: true,
      hidePassword: false,
      animateUsername: false,
      animateEmail: false,
      animatePassword: false,
      animateTerms: false,
      showUsernameErrorDetails: false,
      showEmailErrorDetails: false,
      showPasswordErrorDetails: false,
      usernameErrorText: '',
      emailErrorText: '',
    };
  },
  watch: {
    usernameValue(val) {
      this.name = val.replace(/\W/g, "");
    },
  },
  methods: {
    checkInput1() {
      this.hasValue1 = this.formData.usernameValue !== '';
    },
    checkInput2() {
      this.hasValue2 = this.formData.emailValue !== '';
    },
    checkInput3() {
      this.hasValue3 = this.formData.passwordValue !== '';
    },
    nameKeydown(e) {
      if (/^\W$/.test(e.key)) {
        e.preventDefault();
      }
    },
    togglePasswordDisplay(bool){
        if(bool){
            this.showPassword = false
            this.hidePassword = true
            this.inputType = "text"
        }else{
            this.showPassword = true
            this.hidePassword = false
            this.inputType = "password"
        }
    },
    forgotPassword(){
        console.log("password continue")
    },
    async register() {
      this.showUsernameErrorDetails = false;
      this.showEmailErrorDetails = false;
      this.showPasswordErrorDetails = false;
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        if (!response.ok) {
          const data = await response.json();
          if (data.message === 'Email is not available') {

            this.emailErrorText = 'Se pare că acest e-mail este deja utilizat.'
            this.showEmailErrorDetails = true;
            this.animateEmail = true;
            setTimeout(() => {
              this.animateEmail = false;
            }, 500);

          } else if (data.message === 'Username is not available') {

            this.usernameErrorText = 'Nume deja folosit.'
            this.showUsernameErrorDetails = true;
            setTimeout(() => {
              this.animateUsername = false;
            }, 500);

          } else if(data.message === 'Email is not correct'){

            this.animateEmail = true;
            this.emailErrorText = 'Este necesar un e-mail valid : ex@abc.xyz'
            this.showEmailErrorDetails = true;
            setTimeout(() => {
              this.animateEmail = false;
            }, 500);

          }else if(data.message === 'Username is too small') {

            this.animateUsername = true;
            this.usernameErrorText = 'Minim 3 caractere.'
            this.showUsernameErrorDetails = true;
            // Reset animation after 1 second (adjust as needed)
            setTimeout(() => {
              this.animateUsername = false;
            }, 500);

          }else if(data.message === 'Password is not correct'){

            this.animatePassword = true;
            this.showPasswordErrorDetails = true;
            setTimeout(() => {
              this.animatePassword = false;
            }, 500);


          }else if(data.message === 'Not agreed to terms'){
            this.animateTerms = true;
            setTimeout(() => {
              this.animateTerms = false;
            }, 500);

          }else{
            console.log('Registration failed');
          }
        } else {
          const data = await response.json();
          const token = data.JWTtoken;
          localStorage.setItem('authToken', token); // Store token in local storage
          router.push('/home');
        }

        

        // Continue with your code...
      } catch (error) {
        console.error('Error during registration:', error);
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
            router.push('/home');
          }
        } catch (error) {
          console.error('Automatic login failed:', error);
          localStorage.removeItem('authToken');
        }
      }
    },
    connectDiscord(){
      window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1137834669296062565&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhome&scope=identify+email"
    },
  },
  mounted(){
    this.checkUserToken();
  }
};
</script>

<style scoped>
.BackgroundOverlay{
position: absolute;
  height: 100.05vh;
  top: -0.05vh;
  left: 0vh;
  width: 142vh;
  background-color: rgba(0,0,0,0.75);
}
.UIBackground{
    position: absolute;
  height: 100.1vh;
  top: -0.05vh;
  left: 0vh;
  width: 142vh;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(../assets/SoloLevelingBackground.jpg);
  background-color: black;
  filter: blur(1vh);
}
.RegisterBox{
    position: absolute;
    top: 0vh;
    right: 0vh;
    width: 60vh;
    height: 100vh;
    background-image: 
    radial-gradient(circle at center, rgba(255,255,255,.005) 0, rgba(255,255,255,0.005) 1px, transparent 1px),
    linear-gradient(to right, rgba(255,255,255, 0.01) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255, 0.01) 1px, transparent 1px);
    background-size: 50px 50px;
    background-color: rgba(29,29,29,1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.Title{
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 3.5vh;
    letter-spacing: 0.25vh;
    color: white;
    position: absolute;
    top: 20vh;
    user-select: none;
}
.Input{
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    position: relative;
    color: white;
    width: 40vh;
    height: 5vh;
    background-color: transparent;
    top: 1vh;
    left: 2vh;
    outline: none;
    border: none;
    font-size: 2.25vh;
}
.inputText{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 2.25vh;
    color: gray;
    position: relative;
    top: 1vh;
    left: -27.6vh;
    transition: 0.5s;
    pointer-events: none;
    user-select: none;
}

.inputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31vh;
}
.Input:focus + .inputText{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31vh;
}

.username{
    position: absolute;
    top: 30vh;
    width: 40vh;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
}

.username:focus-within{
    border: 0.25vh solid var(--primary-color);
}

.errorDetails{
  position: absolute;
  z-index: 1;
  right: 15vh;
}

.exclamationMark{
  position: absolute;
  top: 0.9vh;
  right: -3.5vh;
  color: rgb(146, 60, 60);
  width: 2.5vh;
  height: 2.5vh;
  z-index: 100;
}

.errorDetailsBox{
  position: absolute;
  height: 3vh;
  clip-path: inset(0 0 0 100%);
  top: 0.5vh;
  right: -4vh;
  z-index: 2;
  background-color: rgb(29,29,29);
  border-radius: 0.5vh;
  border: 0.25vh solid red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.errorDetails:hover .errorDetailsBox{
  animation: reveal 0.5s forwards ease-in-out;
}

@keyframes reveal {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.detail{
  user-select: none;
  pointer-events: none;
  position: relative;
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 1.15vh;
  color: gray;
  left: 0.5vh;
}

.email{
    position: absolute;
    top: 40vh;
    width: 40vh;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
}
.email:focus-within{
    border: 0.25vh solid var(--primary-color);
}

#emailInputText{
    left: -32.25vh;
}

#emailInputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -34.15vh;
}
.Input:focus + #emailInputText{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -34.15vh;
}

.password{
    position: absolute;
    top: 50vh;
    width: 40vh;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
}

.animate-error {
    border: 0.25vh solid red;
    animation: moveLeftRight 0.25s ease-in-out;
  }
.animate-error2 {
  animation: moveLeftRight 0.25s ease-in-out;
}


  @keyframes moveLeftRight {
    0% {
      transform: translateX(0vh);
    }
    25%{
      transform: translateX(2vh);
    }
    75%{
      transform: translateX(-2vh);
    }
    100% {
      transform: translateX(0vh); /* Adjust the distance as desired */
    }
  }

.password:focus-within{
    border: 0.25vh solid var(--primary-color);
}
.showPasswordIcon{
    position: absolute;
    color: white;
    left: 36vh;
    top: 4vh;
    width: 2vh;
    height: 2vh;
    cursor: pointer;
}

.checkBox{
    position: absolute;
    top: 60vh;
    left: 10vh;
    width: 1.5vh;
    height: 1.5vh;
    outline: 0.25vh solid var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.check {
  display: inline-block;
  transform: rotate(45deg);
  height: 0.8vh;
  width: 0.4vh;
  border-bottom: 0.4vh solid var(--primary-color);
  border-right: 0.4vh solid var(--primary-color);
  pointer-events: none;
}
.checkBoxText{
    cursor: auto;
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.5vh;
    width: max-content;
    color: gray;
    left: 2vh;
    top: -0.1vh;
    user-select: none;
}

.loginText{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.5vh;
    color: gray;
    cursor: pointer;
    right: 10vh;
    top: 60vh;
    user-select: none;
}


.registerButton{
    color: white;
    position: absolute;
    width: 40vh;
    height: 6vh;
    background-color: rgba(29,29,29,0);
    outline: 0.25vh solid white;
    cursor: pointer;
    border-radius: 0.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 70vh;
    transition: 0.5s;
}
.registerButton:hover{
    color: var(--primary-color);
    outline: 0.25vh solid var(--primary-color);
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    background-color: rgba(29,29,29,0.5);
}
.registerText{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 1.75vh;
    color: inherit;
    pointer-events: none;
    user-select: none;
}

.optionsText{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.35vh;
    color: gray;
    top: 80vh;
    user-select: none;
}

.connectDiscord{
  position: absolute;
    top: 84vh;
    right: 28vh;
    width: 4vh;
    height: 4vh;
    background-color: #5865F2;
    border-radius: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.25s ease-in;
}
.connectDiscord:hover{
  background-color: white;
}
.connectDiscord:hover .connectDiscordIcon{
  color: #5865F2;
}
.connectDiscordIcon{
  pointer-events: none;
  color: white;
  width: 2vh;
  height: 2vh;
  transition: 0.25s ease-in;
}

</style>