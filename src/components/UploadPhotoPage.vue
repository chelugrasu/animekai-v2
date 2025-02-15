<template>
  <div>
    <div>
      <input type="file" @change="handleHeaderFileChange" accept="image/*" multiple>
      <input type="text" v-model="headerFileName" placeholder="Enter file name for headerPhotos (without extension)">
    </div>
    <div>
      <input type="file" @change="handlePosterFileChange" accept="image/*" multiple>
      <input type="text" v-model="posterFileName" placeholder="Enter file name for posterPhotos (without extension)">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerFileName: '',
      posterFileName: ''
    };
  },
  methods: {
    handleHeaderFileChange(event) {
      const files = event.target.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileNameWithExtension = this.headerFileName.trim() + '-headerPhoto.jpg';
        this.compressAndUpload(file, fileNameWithExtension, 'headerPhotos');
      }
    },
    handlePosterFileChange(event) {
      const files = event.target.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileNameWithExtension = this.posterFileName.trim() + '-posterPhoto.jpg';
        this.compressAndUpload(file, fileNameWithExtension, 'posterPhotos');
      }
    },
    async compressAndUpload(file, fileName, folder) {
      try {
        const compressedFile = await this.compressImage(file);
        this.uploadImage(compressedFile, fileName, folder);
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    },
    compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              blob => {
                const compressedFile = new File([blob], 'compressed_image.jpg', {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              },
              'image/jpeg',
              0.7
            );
          };
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    },
    uploadImage(file, fileName, folder) {
      const formData = new FormData();
      formData.append('image', file, fileName);
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/uploadFiles/${folder}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        console.log('Image uploaded successfully:', fileName);
      })
      .catch(error => {
        console.error('Image upload failed:', error);
      });
    }
  }
};
</script>
