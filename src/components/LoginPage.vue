<template>
        <div class="BackgroundOverlay">
        <div class="UIBackground"></div>
    </div>
    <div class="LoginBox">
        <div class="Title">Conectează-te</div>
        <div class="email" :class="{'animate-error': animateEmail}">
            <input class="Input" type="email" v-model="formData.emailValue" @blur="checkInput2" />
            <label class="inputText" id="emailInputText" :class="{ 'has-value': hasValue2 }">Email</label>
        </div>
        <div class="password" :class="{'animate-error': animatePassword}">
            <input class="Input" v-bind:type="inputType" v-model="formData.passwordValue" @blur="checkInput3" />
            <label class="inputText" :class="{ 'has-value': hasValue3 }">Password</label>
            <font-awesome-icon class="showPasswordIcon" v-show="showPassword" :icon="['fas', 'eye-slash']" @click="togglePasswordDisplay(true)"/>
            <font-awesome-icon class="showPasswordIcon" v-show="hidePassword" :icon="['fas', 'eye']" @click="togglePasswordDisplay(false)"/>
        </div>
        <div class="checkBox" @click="checkBox()">
            <div class="check" v-show="formData.checkedBox"></div>
            <div class="checkBoxText">Ține-mă minte</div>
        </div>
        <router-link to="/forgot-password">
          <div class="forgotPassword">Ai uitat parola?</div>
        </router-link>
        <router-link to="/register">
          <div class="registerText">Nu ai un cont?</div>
        </router-link>
        <div class="loginButton" @click="login()">
            <div class="loginText">CONECTARE</div>
        </div>
        <div class="optionsText">sau conectează-te folosind</div>
        <div class="options">
            <!-- <div class="connectGoogle">
              <font-awesome-icon class="connectGoogleIcon" :icon="['fab', 'google']" />
            </div> -->
          
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
            loginType: 'normal',
            emailValue: '',
            passwordValue: '',
            checkedBox: false,
        },
      hasValue2: false,
      hasValue3: false,
      inputType: 'password',
      showPassword: true,
      hidePassword: false,
      animateEmail: false,
      animatePassword: false,
    };
  },
  methods: {
    checkInput2() {
      this.hasValue2 = this.formData.emailValue !== '';
    },
    checkInput3() {
      this.hasValue3 = this.formData.passwordValue !== '';
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
    checkBox(){
        if (this.formData.checkedBox){
            this.formData.checkedBox = false;
        }else{
            this.formData.checkedBox = true;
        }
    },
    async login() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        if (!response.ok) {
          const data = await response.json();
          if (data.message === "Invalid credentials") {
            console.log('here')

            this.animateEmail = true;
            this.animatePassword = true;
            setTimeout(() => {
              this.animateEmail = false;
              this.animatePassword = false;
            }, 500);
          }else{
            console.log('Log-in failed');
          }
        }else {
          const data = await response.json();
            if(data){
              const token = data.token;
              localStorage.setItem('authToken', token); // Store token in local storage
              router.push('/home');
              console.log('Log-in successful.');
            }
        }

        

        // Continue with your code...
      } catch (error) {
        console.error('Error during log-in:', error);
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
            console.log(userData.user.userId)
          }else(
            console.log('not logged in')
          )
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
    this.checkUserToken()
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
  background-image: url(../assets/OnePieceBackground.jpeg);
  background-color: black;
  filter: blur(1vh);
}
.LoginBox{
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

.email{
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
    top: 42.5vh;
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
    left: 33vh;
    top: 4vh;
    width: 2vh;
    height: 2vh;
    cursor: pointer;
}
.checkBox{
    position: absolute;
    top: 55vh;
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
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.5vh;
    width: 10vh;
    color: gray;
    cursor: pointer;
    left: 2vh;
    top: -0.1vh;
    user-select: none;
}

.forgotPassword{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.5vh;
    color: gray;
    cursor: pointer;
    right: 10vh;
    top: 57.25vh;
    user-select: none;
}

.registerText{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1.5vh;
    color: gray;
    cursor: pointer;
    right: 10vh;
    top: 55vh;
    user-select: none;
}

.loginButton{
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
    top: 65vh;
    transition: 0.5s;
}
.loginButton:hover{
    color: var(--primary-color);
    outline: 0.25vh solid var(--primary-color);
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    background-color: rgba(29,29,29,0.5);
}
.loginText{
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
    top: 75vh;
    user-select: none;
}

.connectGoogle{
    position: absolute;
    top: 80vh;
    right: 30vh;
    width: 3.5vh;
    height: 3.5vh;
    background-color: white;
    border-radius: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.25s ease-in;
}
.connectGoogle:hover{
  background-color: #5865F2;
}
.connectGoogle:hover .connectGoogleIcon{
  color: white;
}
.connectGoogleIcon{
  pointer-events: none;
  color: #5865F2;
  width: 2vh;
  height: 2vh;
  transition: 0.25s ease-in;
}

.connectDiscord{
  position: absolute;
    top: 80vh;
    right: 27.75vh;
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