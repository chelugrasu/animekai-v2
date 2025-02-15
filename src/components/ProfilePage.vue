<template>
    <div class="background">
        <div class="leftPanel">
            <div class="profileImage">
                <img v-if="isOnPage" class="profilePicture" :src="getProfilePicture(this.profileData.profile_picture)" loading="lazy">
                <div class="darkCover"></div>
                <div class="bottomBar">
                    <p>{{ this.profileData.memberUsername }}</p>
                </div>
            </div>

            <div class="leftPanelContainer">
                <p class="containerTitle">Membru din:</p>
                <p class="containerSubTitle">{{ profileData.registerDate }}</p>
                <font-awesome-icon class="containerIcon" :icon="['fas', 'calendar-days']" size="xl"/>
            </div>
            <div class="leftPanelContainer">
                <p class="containerTitle">Despre mine</p>
                <p class="containerSubTitle">{{ profileData.aboutMe }}</p>
            </div>
        </div>
        <div class="middlePanel">
            <div class="buttons">
                <div class="allButtons">
                    <div :class="{'buttonContainer': true, 'buttonContainer-active': activeButton === 'watchedSeries'}" @click="changeContent('watchedSeries')">
                        <p>
                            Serii vizionate 
                            <span v-if="activeButton == 'watchedSeries' && profileData.showWatchedSeries || activeButton == 'watchedSeries' && isUserOwner" class="buttonCounter">{{ this.watchList.length }}</span>
                            <font-awesome-icon v-if="activeButton == 'watchedSeries' && !profileData.showWatchedSeries && !isUserOwner" class="buttonCounter" :icon="['fas', 'eye-slash']"/>
                        </p>
                    </div>
                    <div :class="{'buttonContainer': true, 'buttonContainer-active': activeButton === 'reviews'}" @click="changeContent('reviews')">
                        <p>
                            Recenzii 
                            <span v-if="activeButton == 'reviews' && profileData.showReviews || activeButton == 'reviews' && isUserOwner" class="buttonCounter">{{ this.watchList.length }}</span>
                            <font-awesome-icon v-if="activeButton == 'reviews' && !profileData.showReviews && !isUserOwner" class="buttonCounter" :icon="['fas', 'eye-slash']"/>
                        </p>
                    </div>
                    <div v-if="isUserOwner" :class="{'buttonContainer': true, 'buttonContainer-active': activeButton === 'continueWatching'}" @click="changeContent('continueWatching')">
                        <p>Continuă vizionarea <span v-if="activeButton == 'continueWatching'" class="buttonCounter">{{ this.continueWatching.length }}</span></p>
                    </div>
                    <div :class="{'buttonContainer': true, 'buttonContainer-active': activeButton === 'watchList'}" @click="changeContent('watchList')">
                        <p>
                            Listă de vizionare 
                            <span v-if="activeButton == 'watchList' && profileData.showToWatch || activeButton == 'watchList' && isUserOwner" class="buttonCounter">{{ this.watchList.length }}</span>
                            <font-awesome-icon v-if="activeButton == 'watchList' && !profileData.showToWatch && !isUserOwner" class="buttonCounter" :icon="['fas', 'eye-slash']"/>
                        </p>
                        
                    </div>
                    <div v-if="isUserTeam" :class="{'buttonContainer': true, 'buttonContainer-active': activeButton === 'teamWork'}" @click="changeContent('teamWork')">
                        <p>Implicare <span v-if="activeButton == 'teamWork'" class="buttonCounter">{{ this.teamWork.length }}</span></p>
                    </div>
                </div>
            </div>
            <div class="content">
                <div v-for="(content, index) in currentActiveContent" :key="index" style="height: auto; margin-top: 0px;">
                    <!-- Watched Series Container -->
                    <div v-if="activeButton === 'watchedSeries' && profileData.showWatchedSeries && !isUserOwner || activeButton === 'watchedSeries' && isUserOwner" class='contentContainer' @click="redirect(`/${series[findSeriesIndex(content)].url_slug}`)">
                        <img class="contentPicture" :src="getHeaderImage(series[findSeriesIndex(content)].header_photo)" loading="lazy">
                        <div class="contentBottom">
                            <p class="contentTitle">{{ series[findSeriesIndex(content)].title }}</p>
                            <p class="contentSubTitle">{{ getSeriesGenres(series[findSeriesIndex(content)].genre)  }}</p>
                            <div class="contentRating" style="transform: scale(1);">
                                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getReview(series[findSeriesIndex(content)].rating, star) }" :icon="['fas', 'star']" size="sm" />
                            </div>
                        </div>
                    </div>

                    <!--Reviews Container-->
                    <div v-if="activeButton === 'reviews' && profileData.showReviews && !isUserOwner || activeButton === 'reviews' && isUserOwner" class='reviewContentContainer' @click="redirect(`/${content.reviewed_series_slug}`)">
                        <div class="reviewContainerTitle">
                            {{series[findSeriesIndex(content.reviewed_series_slug)].title}}
                            <div class="reviewContainerRating" style="transform: scale(1.1);">
                                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getReview(content.review_rating, star) }" :icon="['fas', 'star']" size="sm" />
                            </div>
                        </div>

                        <p class="reviewContainerSubTitle">{{ getDate(content.review_date) }}</p>
                        <p class="reviewContainerDescription">{{content.review_description}}</p>
                    </div>

                    <!--Continue Watching Container-->
                    <div v-if="activeButton === 'continueWatching' && isUserOwner" class='contentContainer' @click="redirect(`/watch/${content.episode_id}`)">
                        <img class="contentPicture" :src="content.video_thumbnail" loading="lazy">
                        <div class="contentBottom">
                            <p class="contentTitle">{{ series[findSeriesIndex(content.series_slug)].title }}</p>
                            <p class="contentSubTitle">{{ content.episode_title }}</p>
                            <p class="contentRating" style="font-size: 16px;">{{ formatTime(content.continue_time) }} <span style="color: var(--primary-color)">/</span> {{ formatTime(content.episode_length) }}</p>
                            <progress :value="content.continue_time" :max="content.episode_length" class="contentProgress"></progress>
                        </div>
                    </div>

                    <!--Watch List Container-->
                    <div v-if="activeButton === 'watchList' && profileData.showToWatch && !isUserOwner || activeButton === 'watchList' && isUserOwner" class='contentContainer' @click="redirect(`/${series[findSeriesIndex(content)].url_slug}`)">
                        <img class="contentPicture" :src="getHeaderImage(series[findSeriesIndex(content)].header_photo)" loading="lazy">
                        <div class="contentBottom">
                            <p class="contentTitle">{{ series[findSeriesIndex(content)].title }}</p>
                            <p class="contentSubTitle">{{ getSeriesGenres(series[findSeriesIndex(content)].genre)  }}</p>
                            <div class="contentRating" style="transform: scale(1);">
                                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getReview(series[findSeriesIndex(content)].rating, star) }" :icon="['fas', 'star']" size="sm" />
                            </div>
                        </div>
                    </div>
                    
                    
                    <!--Team Involvement Container-->
                    <div v-if="activeButton === 'teamWork' && isUserTeam" class='contentContainer' @click="redirect(`/${content.url_slug}`)">
                        <img class="contentPicture" :src="getHeaderImage(content.header_photo)" loading="lazy">
                        <div class="contentBottom">
                            <p class="contentTitle">{{ content.title }}</p>
                            <p class="contentSubTitle">{{ getSeriesGenres(content.genre)  }}</p>
                            <div class="contentRating" style="transform: scale(1);">
                                <font-awesome-icon v-for="star in 5" :key="star" class="star" :style="{ color: getReview(content.rating, star) }" :icon="['fas', 'star']" size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="profileEdit" v-if="showEditProfile && isUserOwner">
            <div class="profileEditContainer">
                <p class="profileEditTitle">Modifică-ți profilul</p>
                <div class="profile-edit-picture-wrapper" @click="showProfilePictures = !showProfilePictures">
                    <img class="profile-edit-picture" :src="getProfilePictureEdit(this.newProfileData.profilePicture)" loading="lazy">
                    <font-awesome-icon :icon="['fas', 'pen']" class="profile-edit-picture-icon" />
                </div>




                <div class="username" :class="{'animate-error': animateUsername, 'has-value': hasValue1}" @keydown="nameKeydown($event)" @paste.prevent>
                    <input class="Input" minlength="3" maxlength="20" type="text" v-model="newProfileData.userName" @blur="checkInput1"/>
                    <label class="inputText" id="usernameInputText" :class="{ 'has-value': hasValue1 }">Nume de utilizator</label>
                    <div class="errorDetails" v-if="showUsernameDetails">
                        <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
                        <div class="errorDetailsBox" style="width: 120px;">
                            <div class="detail">Minim 3 caractere.</div>
                        </div>
                    </div>
                </div>
                <div class="email" :class="{'animate-error': animateEmail, 'has-value': hasValue2}">
                    <input class="Input" type="email" v-model="newProfileData.email" @blur="checkInput2" />
                    <label class="inputText" :class="{ 'has-value': hasValue2 }">Email</label>
                    <div class="errorDetails" v-if="showEmailDetails">
                        <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
                        <div class="errorDetailsBox" style="width: 240px;">
                            <div class="detail">Este necesar un e-mail valid : ex@abc.xyz</div>
                        </div>
                    </div>
                </div>
                <div class="password" :class="{'animate-error': animatePassword, 'has-value': hasValue3}">
                    <input class="Input" maxlength="25" :type="showPassword ? 'text' : 'password'" v-model="newProfileData.password" @blur="checkInput3" />
                    <label class="inputText" :class="{ 'has-value': hasValue3 }">Parolă</label>
                    <font-awesome-icon v-if="!showPassword" :icon="['fas', 'eye']" class="reveal-new-password" @click="showPassword = true"/>
                    <font-awesome-icon v-if="showPassword" :icon="['fas', 'eye-slash']" class="reveal-new-password" @click="showPassword = false"/>
                    <div class="errorDetails" style="margin-left: 75%; margin-top: -12.5%;" v-if="showPasswordDetails">
                        <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
                        <div class="errorDetailsBox" style="width: 240px;">
                            <div class="detail">Minim 8 caractere, cu o majusculă și o cifră.</div>
                        </div>
                    </div>
                </div>
                <div class="profile-edit-about-me">
                    <textarea v-text="newProfileData.aboutMeValue" class="aboutMeTextarea" :class="{'has-value': hasValue4}" maxlength="300" placeholder="About me..." @input="newProfileData.currentCharacters = $event.target.value.length; newProfileData.aboutMeValue = $event.target.value" @blur="checkInput4"></textarea>
                    <p class="aboutMeCounter">{{ newProfileData.currentCharacters }} / 300</p>
                </div>

                <div class="profile-edit-settings">
                    <div class="profile-edit-setting" id="watched-series-setting">
                        <p class="profile-edit-setting-title">Serii vizionate</p>
                        <div class="profile-edit-toggle" :class="{'profile-edit-toggle-active': newProfileData.showWatchedSeries}" @click="newProfileData.showWatchedSeries = !newProfileData.showWatchedSeries">
                            <div class="profile-edit-toggle-circle" :class="{'profile-edit-toggle-circle-active': newProfileData.showWatchedSeries}">
                                <font-awesome-icon v-show="newProfileData.showWatchedSeries" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye']"/>
                                <font-awesome-icon v-show="!newProfileData.showWatchedSeries" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye-slash']"/>
                            </div>
                        </div>
                    </div>
                    <div class="profile-edit-setting" id="reviews-setting">
                        <p class="profile-edit-setting-title">Recenzii</p>
                        <div class="profile-edit-toggle" :class="{'profile-edit-toggle-active': newProfileData.showReviews}" @click="newProfileData.showReviews = !newProfileData.showReviews">
                            <div class="profile-edit-toggle-circle" :class="{'profile-edit-toggle-circle-active': newProfileData.showReviews}">
                                <font-awesome-icon v-show="newProfileData.showReviews" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye']"/>
                                <font-awesome-icon v-show="!newProfileData.showReviews" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye-slash']"/>
                            </div>
                        </div>
                    </div>
                    <div class="profile-edit-setting" id="to-watch-setting">
                        <p class="profile-edit-setting-title">Listă de vizionare</p>
                        <div class="profile-edit-toggle" :class="{'profile-edit-toggle-active': newProfileData.showToWatch}" @click="newProfileData.showToWatch = !newProfileData.showToWatch">
                            <div class="profile-edit-toggle-circle" :class="{'profile-edit-toggle-circle-active': newProfileData.showToWatch}">
                                <font-awesome-icon v-show="newProfileData.showToWatch" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye']"/>
                                <font-awesome-icon v-show="!newProfileData.showToWatch" class="profile-edit-toggle-circle-icon" :icon="['fas', 'eye-slash']"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showProfilePictures" class="profile-pictures">
                    <div class="profile-pictures-categories">
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 0}" @click="currentPictureCategory = 'demon-slayer'; activeCategory = 0">
                            <p>Demon Slayer</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 1}" @click="currentPictureCategory = 'one-piece'; activeCategory = 1">
                            <p>One Piece</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 2}" @click="currentPictureCategory = 'jujutsu-kaisen'; activeCategory = 2">
                            <p>Jujutsu Kaisen</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 3}" @click="currentPictureCategory = 'chainsaw'; activeCategory = 3">
                            <p>Chainsaw Man</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 4}" @click="currentPictureCategory = 'hxh'; activeCategory = 4">
                            <p>Hunter x Hunter</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 5}" @click="currentPictureCategory = 'mha'; activeCategory = 5">
                            <p>My Hero Acad..</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 6}" @click="currentPictureCategory = 'spy-x-family'; activeCategory = 6">
                            <p>Spy x Family</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 7}" @click="currentPictureCategory = 'dbz'; activeCategory = 7">
                            <p>Dragon Ball Z</p>
                        </div>
                        <div class="profile-picture-category" :class="{'profile-picture-category-active': activeCategory === 8}" @click="currentPictureCategory = 'naruto'; activeCategory = 8">
                            <p>Naruto</p>
                        </div>
                    </div>

                    <div class="profile-pictures-content">
                        <div v-for="(profilePicture, index) in filteredPictures" :key="index" class="profile-pictures-image-wrapper" @click="newProfileData.profilePicture = profilePicture.fileName; showProfilePictures = !showProfilePictures">
                            <img class="profile-pictures-image" width="100px" height="100px" :src="getProfilePicture(profilePicture.fileName)" value="profilePicture.fileName" loading="lazy">
                        </div>
                    </div>
                </div>
                <div class="finishing-choices">
                    <div class="close-menu-choice" @click="showEditProfile = !showEditProfile">
                        <p>Anulați</p>
                    </div>
                    <div class="continue-choice" @click="updateProfileData">
                        <p>Continuă</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="notificationData.showNotification && isUserOwner" class="notification">
            <div class="notification-container">
                <p class="notification-title" :style="{ color: notificationData.notificationTitleColor }">{{ notificationData.notificationTitle }}</p>
                <p class="notification-date">{{ notificationData.notificationDate }}</p>
                <p class="notification-content" v-html="notificationData.notificationContent"></p>
                <div class="notification-close-button" @click="notificationData.showNotification = !notificationData.showNotification">
                    <p>Am înțeles</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router';
export default {
    data() {
        return{
            isOnPage: false,
            profileData: {
                isLoggedIn: false,
                userName: '',  
                memberUsername: '',
                registerDate: '',
                aboutMe: '',
                showWatchedSeries: true,
                showReviews: true,
                showToWatch: true,
            },
            isUserOwner: false,
            isUserTeam: false,
            activeButton: 'watchedSeries',
            series: [],
            episodes: [],
            watchedSeries: [],
            reviews: [],
            continueWatching: [],
            watchList: [],
            teamWork: [],
            currentActiveContent: [],
            stars: [1, 2, 3, 4, 5],

            activeCategory: 0,
            profilePictures: [],
            currentPictureCategory: 'demon-slayer',
            showEditProfile: false,
            hasValue1: false,
            hasValue2: false,
            hasValue3: false,
            hasValue4: false,
            animateUsername: false,
            animateEmail: false,
            animatePassword: false,
            showUsernameDetails: false,
            showEmailDetails: false,
            showPasswordDetails: false,
            showProfilePictures: false,
            showPassword: false,
            newProfileData: {
                profilePicture: '',
                userName: '',
                email: '',
                password: '',
                aboutMeValue: '',
                currentCharacters: 0,
                showWatchedSeries: false,
                showReviews: false,
                showToWatch: false,
                oldProfileData: [],
            },
            notificationData: {
                showNotification: false,
                notificationTitle: '',
                notificationTitleColor: '',
                notificationDate: '',
                notificationContent: ``,
            }
        };
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
                    this.profileData.memberUsername = this.$route.params.username;
                    this.profileData.userName = userData.username
                    this.profileData.isLoggedIn = true
                    this.loadProfilePage();
                }else{
                    this.profileData.memberUsername = this.$route.params.username;
                    this.isLoggedIn = false
                    this.loadProfilePage();
                }
                } catch (error) {
                console.error('Automatic login failed:', error);
                // localStorage.removeItem('authToken');
                }
            }else{
                this.profileData.memberUsername = this.$route.params.username;
                this.isLoggedIn = false
                this.loadProfilePage();
            }
        },
        async loadProfilePage(){
            const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/loadProfilePage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.profileData)
            });
            if (response.ok) {
            const data = await response.json();
            const dataProfile = data.profileData
            this.isOnPage = true;
            this.isUserOwner = dataProfile.isOwner
            this.isUserTeam = dataProfile.isAdmin
            if(dataProfile.viewedSeries){this.watchedSeries = dataProfile.viewedSeries; this.watchedSeries.reverse();}
            if(dataProfile.reviews){this.reviews = dataProfile.reviews; this.reviews.reverse();}
            if(dataProfile.continueWatching){
                this.continueWatching = dataProfile.continueWatching
                this.continueWatching.reverse();
            }
            if(dataProfile.toWatchSeries){this.watchList = dataProfile.toWatchSeries; this.watchList.reverse();}
            if(data.seriesData){this.series = data.seriesData}
            this.profileData.memberUsername = dataProfile.userData.memberUsername
            this.profileData.registerDate = this.getDate(dataProfile.userData.registerDate)
            this.profileData.aboutMe = dataProfile.userData.aboutMe
            this.profileData.profile_picture = dataProfile.userData.profilePicture
            const profileSettings = JSON.parse(dataProfile.userData.profile_settings)
            this.profileData.showWatchedSeries = profileSettings[0].watchedSeries; this.profileData.showReviews = profileSettings[0].reviews; this.profileData.showToWatch = profileSettings[0].toWatch;
            

            this.newProfileData.profilePicture = dataProfile.userData.profilePicture
            this.newProfileData.userName = dataProfile.userData.memberUsername
            this.newProfileData.email = dataProfile.userData.email
            this.newProfileData.aboutMeValue = dataProfile.userData.aboutMe
            this.newProfileData.oldProfileData = dataProfile.userData
            this.hasValue1 = true; this.hasValue2 = true; if(this.newProfileData.aboutMeValue){this.hasValue4 = true}
            this.newProfileData.showWatchedSeries = profileSettings[0].watchedSeries; this.newProfileData.showReviews = profileSettings[0].reviews; this.newProfileData.showToWatch = profileSettings[0].toWatch
            this.currentActiveContent = dataProfile.viewedSeries
            this.getInvolvedSeries()

            const urlSearchParams = new URLSearchParams(window.location.search);
            if (urlSearchParams.has('edit_profile')) {
                this.showEditProfile = true
            }else if(urlSearchParams.has('continue_watching')){
                this.$nextTick(() => {
                    this.changeContent('continueWatching')
                });
            }else if(urlSearchParams.has('email_sent')){
                const email = urlSearchParams.get('email_sent');
                this.notificationData.showNotification = true
                this.notificationData.notificationTitle = 'Notificare modificări'
                this.notificationData.notificationTitleColor = 'rgb(0,200,0)'
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                this.notificationData.notificationDate = `${formattedDate}`
                this.notificationData.notificationContent = 
                `
                    Un email a fost expediat către adresa de email: 
                    <br>
                    <br>
                    <span style="color: #f6b700; font-size: 18px; font-weight: 700;">${email}</span>
                    <br>
                    <br>
                    Pentru confimarea contului de email , continuați pașii din e-mail-ul expediat.
                    <br>
                    Email-ul poate ajunge în maximum 10 minute, dacă acesta nu a ajuns raportează pe discord sau email-ul nu este valid.
                `
            }else if(urlSearchParams.has('password_changed')){
                this.notificationData.showNotification = true
                this.notificationData.notificationTitle = 'Notificare modificări'
                this.notificationData.notificationTitleColor = 'rgb(0,200,0)'
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                this.notificationData.notificationDate = `${formattedDate}`
                this.notificationData.notificationContent = 
                `
                    Parola dumneavoastră a fost schimbată cu succes.
                    <br>
                    <br>
                    Dacă cumva parola pe care ați introdus-o este greșită vă sugerăm să folosiți <span style="color: #f6b700;")">pagina de recuperare.</span>
                `
            }
            
            if(urlSearchParams.has('password_changed') && urlSearchParams.has('email_sent')){
                const email = urlSearchParams.get('email_sent');
                this.notificationData.showNotification = true
                this.notificationData.notificationTitle = 'Notificare modificări'
                this.notificationData.notificationTitleColor = 'rgb(0,200,0)'
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                this.notificationData.notificationDate = `${formattedDate}`
                this.notificationData.notificationContent = 
                `
                    Un email a fost expediat către adresa de email: 
                    <br>
                    <br>
                    <span style="color: #f6b700; font-size: 18px; font-weight: 700;">${email}</span>
                    <br>
                    <br>
                    Pentru confimarea contului de email , continuați pașii din e-mail-ul expediat.
                    <br>
                    Email-ul poate ajunge în maximum 10 minute, dacă acesta nu a ajuns raportează pe discord sau email-ul nu este valid.
                    <br>
                    <br>
                    <div style="
                        width: 100%;
                        height: 2px;
                        border-radius: 100%;
                        background-color: rgb(255,255,255,.3);
                    "></div>
                    <br>
                    Parola dumneavoastră a fost schimbată cu succes.
                    <br>
                    <br>
                    Dacă cumva parola pe care ați introdus-o este greșită vă sugerăm să folosiți <span style="color: #f6b700;")">pagina de recuperare.</span>
                `
            }
            
        }
        },
        getProfilePicture(fileName){
            if(this.profileData.memberUsername){
                const profilePicture = `${fileName}.png`;
                let imageUrl;

                try {
                    imageUrl = require(`@/assets/profilePhotos/${profilePicture}`);
                } catch (error) {
                    imageUrl = require(`@/assets/profilePhotos/photoInexistent-profilePhoto.png`);
                }

                return imageUrl;
            }
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
        changeContent(content){
            this.currentActiveContent = []
            if(content === 'watchedSeries'){
                this.currentActiveContent = this.watchedSeries
            }else if(content === 'reviews'){
                this.currentActiveContent = this.reviews
            }else if(content === 'continueWatching'){
                this.currentActiveContent = this.continueWatching
            }else if(content === 'watchList'){
                this.currentActiveContent = this.watchList
            }else if(content === 'teamWork'){
                this.currentActiveContent = this.teamWork
            }
            this.activeButton = content
        },
        findSeriesIndex(seriesId) {
            for (let i = 0; i < this.series.length; i++) {
                if (this.series[i].url_slug === seriesId) {
                    return i;
                }
            }
            return 'Inexistent';
        },
        getSeriesGenres(genre){
            const seriesGenresArray = JSON.parse(genre);
            const formattedGenres = seriesGenresArray.join(', ');
            return formattedGenres
        },
        getReview(rating, star){
            return star <= rating ? 'yellow' : 'gray';
        },
        redirect(url){
            router.push(url)
        },
        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds % 60).padStart(2, '0');
            return hours > 0 ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}` : `${formattedMinutes}:${formattedSeconds}`;
        },
        getDate(object){
            const dateObj = new Date(object);
            const day = ('0' + dateObj.getDate()).slice(-2);
            const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
            const year = dateObj.getFullYear();
            return `${day}/${month}/${year}`;
        },
        getInvolvedSeries(){
            this.series.forEach(seriesItem => {
            // Check if the targetName exists in the involved_team array of the current series
            if (seriesItem.involved_team && seriesItem.involved_team.includes(this.profileData.memberUsername)) {
                this.teamWork.push(seriesItem);
            }
            });
            this.teamWork.reverse();
        },
        getProfilePictureEdit(pictureId){
            if(this.profileData.memberUsername){
                const profilePicture = `${pictureId}.png`;
                let imageUrl;

                try {
                    imageUrl = require(`@/assets/profilePhotos/${profilePicture}`);
                } catch (error) {
                    imageUrl = require(`@/assets/profilePhotos/photoInexistent-profilePhoto.png`);
                }

                return imageUrl;
            }
        },
        checkInput1() {
            this.hasValue1 = this.newProfileData.userName !== '';
        },
        checkInput2() {
            this.hasValue2 = this.newProfileData.email !== '';
        },
        checkInput3() {
            this.hasValue3 = this.newProfileData.password !== '';
        },
        checkInput4(){
            this.hasValue4 = this.newProfileData.aboutMeValue !== '';
        },
        createProfilePictures(){
            this.profilePictures = [
            ...Array.from({ length: 20 }, (_, index) => ({ category: 'demon-slayer', fileName: `demon-slayer-${index + 1}` })),
            ...Array.from({ length: 18 }, (_, index) => ({ category: 'one-piece', fileName: `one-piece-${index + 1}` })),
            ...Array.from({ length: 14 }, (_, index) => ({ category: 'jujutsu-kaisen', fileName: `jujutsu-kaisen-${index + 1}` })),
            ...Array.from({ length: 9 }, (_, index) => ({ category: 'chainsaw', fileName: `chainsaw-${index + 1}` })),
            ...Array.from({ length: 9 }, (_, index) => ({ category: 'hxh', fileName: `hxh-${index + 1}` })),
            ...Array.from({ length: 6 }, (_, index) => ({ category: 'mha', fileName: `mha-${index + 1}` })),
            ...Array.from({ length: 8 }, (_, index) => ({ category: 'spy-x-family', fileName: `spy-x-family-${index + 1}` })),
            ...Array.from({ length: 22 }, (_, index) => ({ category: 'dbz', fileName: `dbz-${index + 1}` })),
            ...Array.from({ length: 8 }, (_, index) => ({ category: 'naruto', fileName: `naruto-${index + 1}` }))
            ];
        },
        nameKeydown(e) {
            if (/^\W$/.test(e.key)) {
                e.preventDefault();
            }
        },
        async updateProfileData(){
            this.showUsernameDetails = false;
            this.showEmailDetails = false;
            this.showPasswordDetails = false;
            try{
                const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/updateProfileData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newProfileData)
                });
                if (response.ok) {
                    const data = await response.json();
                    if(data.type === 'normal'){
                        setTimeout(() => {
                            router.push(`/member/${data.username.toLowerCase()}`);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1); // Reload after 1 second
                        }, 1); // Push router after 1 second
                        return
                    }
                    if(data.type === 'email'){
                        setTimeout(() => {
                            router.push(`/member/${data.username.toLowerCase()}/?email_sent=${this.newProfileData.oldProfileData.email}`);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1); // Reload after 1 second
                        }, 1); // Push router after 1 second
                        return
                    }
                    if(data.type === 'normal-password'){
                        setTimeout(() => {
                            router.push(`/member/${data.username.toLowerCase()}/?password_changed`);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1); // Reload after 1 second
                        }, 1); // Push router after 1 second
                        return
                    }
                    if(data.type === 'email-password'){
                        setTimeout(() => {
                            router.push(`/member/${data.username.toLowerCase()}/?password_changed&email_sent=${this.newProfileData.oldProfileData.email}`);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1); // Reload after 1 second
                        }, 1); // Push router after 1 second
                        return
                    }
                }else{
                    const data = await response.json();
                    if(data.message === "Invalid Username"){
                        console.log("Invalid Username")
                        this.animateUsername = true;
                        this.showUsernameDetails = true;
                        setTimeout(() => {
                        this.animateUsername = false;
                        }, 500);
                    }else if(data.message === "Invalid Email"){
                        this.animateEmail = true;
                        this.showEmailDetails = true;
                        setTimeout(() => {
                        this.animateEmail = false;
                        }, 500);
                    }
                    else if(data.message === "Invalid Password"){
                        this.animatePassword = true;
                        this.showPasswordDetails = true;
                        setTimeout(() => {
                        this.animatePassword = false;
                        }, 500);
                    }
                }
            }catch(error){
                console.log(error)
            }
        }
  },
    async mounted(){
        this.checkUserToken()
        this.createProfilePictures()
        const vm = this;
        window.addEventListener('beforeunload', function() {
            vm.isOnPage = false;
        });
    },
    unmounted(){
        this.isOnPage = false;
    },
    computed: {
    filteredPictures() {
      // Filter episodes based on the active season index
      if(this.profilePictures){
        // return null
        return this.profilePictures.filter(profilePicture => profilePicture.category === this.currentPictureCategory);
      }else{
        return null
      }
    }
  },
}
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  overflow: auto; 
  background-image: 
  radial-gradient(circle at center, rgba(255,255,255,.005) 0, rgba(255,255,255,0.005) 1px, transparent 1px),
  linear-gradient(to right, rgba(255,255,255, 0.01) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255, 0.01) 1px, transparent 1px);
  background-size: 50px 50px;
  background-color: #141414;
}

.leftPanel{
    position: absolute;
    top: 100px;
    left: 250px;
    width: 300px;
    /* outline: 1px solid red; */
    display: flex;
    flex-direction: column;
    display: flex;
}

.profileImage{
    user-select: none;
    height: 300px;
    width: 100%;
    transition: 0.3s ease;
}
.darkCover{
    position: relative;
    border-radius: 4.65px;
    top: -305px;
    user-select: none;
    pointer-events: none;
    height: 101%;
    width: 100%;
    background-color: rgb(0,0,0,.4);
    transition: 0.3s ease;
}
.profilePicture{
    user-select: none;
    border-radius: 4.65px;
    object-fit: cover;
    height: 100%;
    width: 100%;
}
.profilePicture:hover +.darkCover{
    transition: 0.3s ease;
    background-color: rgb(0,0,0,0);
}
.profilePicture:hover ~ .bottomBar{
    color: var(--primary-color);
    filter: drop-shadow(0 0 1px var(--primary-color));
}
.profileImage:hover{
    transform: scale(1.025);
}

.bottomBar{
    border-bottom-right-radius: 4.65px;
    border-bottom-left-radius: 4.65px;
    pointer-events: none;
    user-select: none;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 22px;
    position: relative;
    top: -345px;
    width: 100%;
    height: 40px;
    background-color: rgb(40,40,40,.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: 0.3s ease;
}

.leftPanelContainer{
    margin-top: 10px;
    width: 100%;
    height: auto;
    background-color: rgb(40,40,40);
    border-radius: 4.65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    transition: 0.3s ease;
    overflow: hidden;
}

.leftPanelContainer:hover{
    transform: scale(1.025);
    color: var(--primary-color);
    filter: drop-shadow(0 0 2px var(--primary-color));
}

.containerTitle{
    position: absolute;
    left: 20px;
    margin-top: 15px;
    padding-bottom: 5px;
    font-family: 'Roboto', sans-serif;
    color: var(--primary-color);
    font-weight: 500;
    font-size: 17px;
}
.containerSubTitle{
    position: relative;
    width: 260px;
    max-height: 160px;
    margin-top: 40px;
    left: 0px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 15px;
    letter-spacing: 1px;
    padding-bottom: 7.5px;
}

.containerIcon{
    position: absolute;
    right: 20px;
    margin-top: 25px;
}


.middlePanel{
    position: absolute;
    left: 600px;
    top: 102px;
    width: 1100px;
    height: auto;
}
.buttons{
    position: absolute;
    left: 0px;
    width: 100%;
    height: 100px;
}

.allButtons{
    margin-top: 0px;
    display: flex;
    height: 100%;
}
.buttonContainer{
    user-select: none;
    flex-grow: 1;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Roboto',sans-serif;
    font-weight: 400;
    font-size: 21px;
    border-bottom: 1px solid rgb(255,255,255,.1);
    transition: 0.3s ease;
    cursor: pointer;
}

.buttonCounter{
    margin-left: 10px;
    color: white;
    border: 2px solid rgb(50,50,50);
    border-left: 8px solid rgb(50,50,50);
    border-right: 8px solid rgb(50,50,50);
    background-color: rgb(50,50,50);
    border-radius: 100px;
    transition: 0.3s ease;
}

.buttonContainer:hover:not(.buttonContainer-active){
    color: var(--primary-color);
    text-shadow: 0 0 10px var(--primary-color);
    background-color: rgb(30,30,30);
}

.buttonContainer-active{
    color: var(--primary-color);
    text-shadow: 0 0 10px var(--primary-color);
    background-color: rgb(40,40,40, .4);
    border-top: 1px solid rgb(246, 183, 0,.8);
}

.content{
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 120px;
    width: 102%;
    min-height: auto;
    max-height: 675px;
    padding-bottom: 30px;
}

.contentContainer{
    width: 356.5px;
    height: 225px;
    margin-top: 10px;
    margin-left: 10px;
    padding: 0;
    transition: 0.3s ease;
    cursor: pointer;
    border-radius: 4.65px;
    outline: 1px solid transparent;
}

.contentPicture{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 4.65px;
}

.contentBottom{
    position: absolute;
    width: 356.5px;
    height: 50px;
    background-color:rgb(20,20,20,.9);
    border-bottom-left-radius: 4.65px;
    border-bottom-right-radius: 4.65px;
    margin-top: -54px;
    display: flex;
    justify-content: left;
    align-items: center;
    font-size: 20px;
    font-family: 'Roboto',sans-serif;
    font-weight: 300;
    color: white;
}

.contentTitle{
    position: absolute;
    margin-top: 0px;
    margin-left: 10px;
}

.contentSubTitle{
    position: absolute;
    margin-top: 37.5px;
    margin-left: 10px;
    font-size: 15px;
    color: rgb(255,255,255,.6);
}

.contentRating{
    position: absolute;
    margin-left: 250px;
}

.contentContainer:hover{
    transform: scale(1.05);
    outline: 1px solid var(--primary-color);
}

.contentProgress{
    position: absolute;
    bottom: 0px;
    width: 100%;
    background-color: var(--primary-color);
    height: 4px;
}

.contentProgress::-webkit-progress-bar{
    background-color: rgb(40,40,40.8);
}

.contentProgress::-webkit-progress-value {
    background-color: var(--primary-color);
}

.reviewContentContainer{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 1075px;
    min-height: auto;
    max-height: 235px;
    margin-top: 10px;
    margin-left: 10px;
    padding: 10px;
    background-color: rgb(40,40,40);
    border-radius: 4.65px;
    transition: 0.3s ease;
}

.reviewContentContainer:hover{
    outline: 1px solid var(--primary-color);
    transform: scale(1.01);
}

.reviewContainerTitle{
    display: flex;
    flex-direction: row;
    position: relative;
    top: 15px;
    left: 40px;
    color: var(--primary-color);
    font-family: 'Roboto',sans-serif;
    font-weight: 500;
    font-size: 20px;
}
.reviewContainerSubTitle{
    position: relative;
    left: 40px;
    top: 5px;
    color: gray;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 14px;
}

.reviewContainerDescription{
    position: relative;
    margin-top: 5px;
    left: 40px;
    width: 91%;
    min-height: auto;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: white;
    font-size: 16px;
}

.reviewContainerRating{
    margin-left: 15px;
}

.profileEdit{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgb(20,20,20,.9);
    display: flex;
    align-items: center;
    justify-content: center;
}

.profileEditContainer{
    width: 400px;
    height: 700px;
    background-color: rgb(50,50,50);
    display: flex;
    justify-content: center;
    border-radius: 10px 10px 0 0;
    animation: reveal-profile-pictures 0.5s ease-in-out;
}

.profileEditTitle{
    position: relative;
    top: 0;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 24px;

}

.profile-edit-picture{
    width: 100px;
    height: 100px;
}

.profile-edit-picture-wrapper {
    position: absolute;
    top: 215px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    outline: 2.5px solid var(--primary-color);
    box-shadow: 0 0 10px var(--primary-color);
    overflow: hidden;
    cursor: pointer;
    transition: 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-edit-picture-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transition: 0.3s ease;
}
.profile-edit-picture-wrapper:hover::before {
    background-color: rgba(0, 0, 0, 0.5);
}

.profile-edit-picture-icon{
    opacity: 0;
    position: absolute;
    color: white;
    width: 35px;
    height: 35px;
    transition: 0.3s ease;
}

.profile-edit-picture-wrapper:hover .profile-edit-picture-icon{
    opacity: 1;
}



.Input{
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    position: relative;
    color: white;
    width: 350px;
    height: 5vh;
    background-color: transparent;
    top: 2vh;
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
    transition: 0.5s;
    pointer-events: none;
    user-select: none;
    left: 20px;
    bottom: 17.5px;
}

.inputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    left: 22.5px;
    bottom: 40px;
}
.Input:focus + .inputText{
    font-weight: 300;
    font-size: 1.5vh;
    left: 22.5px;
    bottom: 40px;
}

.username{
    position: absolute;
    top: 350px;
    width: 380px;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    transition: 0.5s ease   ;
    background-color: rgb(45,45,45);
}
.username:focus-within{
    border: 0.25vh solid var(--primary-color);
}

.username.has-value{
    border: 0.25vh solid var(--primary-color);
}
.email{
    position: absolute;
    top: 440px;
    width: 380px;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    transition: 0.5s ease;
    background-color: rgb(45,45,45);
}
.email:focus-within{
    border: 0.25vh solid var(--primary-color);
}

.email.has-value{
    border: 0.25vh solid var(--primary-color);
}

.password{
    position: absolute;
    top: 530px;
    width: 380px;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    transition: 0.5s ease;
    background-color: rgb(45,45,45);
}
.password:focus-within{
    border: 0.25vh solid var(--primary-color);
}

.password.has-value{
    border: 0.25vh solid var(--primary-color);
}

.reveal-new-password{
    position: absolute;
    right: 20px;
    top: 30px;
    width: 25px;
    height: 25px;
    color: gray;
    cursor: pointer;
    transition: 0.3s ease;
}


.profile-edit-about-me{
    position: absolute;
    top: 620px;
}

.aboutMeTextarea{
    height: 110px;
    width: 350px;
    border-radius: 1vh;
    border: none;
    outline: none;
    padding: 15px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 2.25vh;
    color: white;
    background-color: rgb(45,45,45);
    resize: none;
    transition: 0.5s ease;
    border: 0.25vh solid transparent;
}
.aboutMeTextarea:focus-within{
    border: 0.25vh solid var(--primary-color);
}
.aboutMeTextarea.has-value{
    border: 0.25vh solid var(--primary-color);
}

.aboutMeCounter{
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: white;
    font-size: 12px;
    margin-top: -30px;
    margin-left: 325px;
    transition: 0.5s ease;
    pointer-events: none;
    user-select: none;
}


.profile-edit-setting{
    position: absolute;
    top: 775px;
    width: 125px;
    display: flex;
    justify-content: center;
    height: 50px;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 15px;
}

#watched-series-setting{
    margin-left: -275px;
}

#reviews-setting{
    margin-left: -170px;
}

#to-watch-setting{
    margin-left: -50px
}

.profile-edit-setting-title{
    margin-top: 0px;
}

.profile-edit-toggle{
    position: absolute;
    top: 25px;
    width: 45px;
    height: 20px;
    border-radius: 20px;
    outline: 2px solid white;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.3s ease;
}

.profile-edit-toggle:hover:not(.profile-edit-toggle-active){
    filter: drop-shadow(0 0 5px white)
}

.profile-edit-toggle-circle{
    width: 35%;
    height: 80%;
    border-radius: 100%;
    background-color: white;
    margin-left: 3.5px;
    transition: 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-edit-toggle-active{
    outline: 2px solid var(--primary-color);
    background-color: rgb(246, 183, 0, .5);
    filter: drop-shadow(0 0 5px var(--primary-color))
}
.profile-edit-toggle-circle-active{
    background-color: rgb(255,255,255,.9);
    transform: translateX(20px);
}

.profile-edit-toggle-circle-icon{
    color: gray;
    width: 11.5px;
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

  .errorDetails{
    position: absolute;
    z-index: 1;
    margin-top: -12.5%;
    margin-left: 85%;
}

.exclamationMark{
  position: absolute;
  top: 0.9vh;
  right: -3.5vh;
  color: rgb(200,0,0, .4);
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
  background-color: rgb(35,35,35);
  border-radius: 0.5vh;
  border: 0.25vh solid rgb(200,0,0, .4);
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 10px;
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
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 1.15vh;
  color: gray;
}

.profile-pictures{
    position: absolute;
    right: 300px;
    width: 400px;
    height: 700px;
    border-radius: 1vh;
    background-color: rgb(50,50,50);
    animation: reveal-profile-pictures 0.5s forwards ease-in-out;
    display: flex;
    justify-content: center;
    clip-path: inset(100% 100% 100% 100%);
}

@keyframes reveal-profile-pictures {
  from {
    clip-path: inset(100% 100% 100% 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}


.profile-pictures-categories{
    margin-top: 10px;
    margin-left: -10px;
    width: 90%;
    height: 150px;
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 5px; /* Reduce column gap */
    grid-auto-rows: 40px; /* Set height for each row */
}

.profile-picture-category{
    width: 120px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40px;
    background-color: rgb(40,40,40, 0.7);
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 400px;
    font-size: 16px;
    user-select: none;
    cursor: pointer;
    transition: 0.3s ease;
}

.profile-picture-category-active{
    color: var(--primary-color);
    filter: drop-shadow(0 0 5px var(--primary-color));
}

.profile-picture-category:hover{
    filter: drop-shadow(0 0 5px var(--primary-color));
    transform: scale(1.05)
}

.profile-pictures-content{
    position: absolute;
    width: 90%;
    height: 500px;
    border-top: 0.1px solid rgb(255,255,255,.1);
    top: 160px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 5px; /* Reduce column gap */
    grid-auto-rows: 120px; /* Set height for each row */
    overflow-y: scroll;
}

.profile-pictures-image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s ease;
}

.profile-pictures-image-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  transition: 0.3s ease;
}
.profile-pictures-image-wrapper:hover{
    transform: scale(1.1)
}
.profile-pictures-image-wrapper:hover::before {
    background-color: rgba(0, 0, 0, 0);
}



.finishing-choices{
    position: absolute;
    bottom: 70px;
    width: 400px;
    height: 60px;
    display: flex;
    flex-direction: row
}

.close-menu-choice{
    width: 200px;
    height: 30px;
    background-color: rgb(146, 60, 60, .5);
    border-radius: 0 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 17px;
    color: white;
    user-select: none;
    cursor: pointer;
    transition: 0.3s ease;
}

.close-menu-choice:hover{
    font-size: 18px;
    filter: drop-shadow(0 0 5px rgb(146, 60, 60));
}

.continue-choice{
    width: 200px;
    height: 30px;
    background-color: rgb(100, 190, 58, .5);
    border-radius: 0 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 17px;
    color: white;
    user-select: none;
    cursor: pointer;
    transition: 0.3s ease;
}

.continue-choice:hover{
    font-size: 18px;
    filter: drop-shadow(0 0 5px rgb(100, 190, 58));
}


.notification{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgb(20,20,20, .7);
    display: flex;
    align-items: center;
    justify-content: center;
    
}

.notification-container{
    position: absolute;
    min-height: 100px;
    max-height: 825px;
    min-width: 300px;
    max-width: 600px;
    padding: 10px;
    background-color: rgb(50,50,50);
    border-radius: 10px;
    font-family: 'Roboto', sans-serif;
    color: white;
    font-weight: 300;
    font-size: 17px;
    display: flex;
    justify-content: center;
    clip-path: inset(0 0 0 0);
    animation: reveal-profile-pictures 0.5s forwards ease-in-out;
}


.notification-title{
    position: absolute;
    margin-top: 5px;
    font-weight: 500;
}

.notification-date{
    position: absolute;
    margin-top: 30px;
    font-weight: 400;
    color: gray;
}

.notification-content{
    margin-top: 65px;
    text-align: center;
    padding-bottom: 50px
}

.notification-close-button{
    position: absolute;
    bottom: 10px;
    width: 150px;
    height: 35px;
    background-color: rgb(40,40,40, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    transition: 0.3s ease;
    cursor: pointer;
}

.notification-close-button:hover{
    background-color: rgb(40,40,40, .6);
    filter: drop-shadow(0 0 5px rgb(0,150,0));
    transform: scale(1.05)
}

</style>
