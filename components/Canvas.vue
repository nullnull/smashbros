<template>
  <div id="root">
    <v-stage
      ref="stage"
      :config="{
        width: width,
        height: height,
    }">
      <v-layer ref="layer">
        <v-image
          :config="{
            image: backgroundImageUrl,
            width: width,
            height: height,
          }"
        />
      </v-layer>
      <v-layer ref="layer">
        <v-image
          :config="{
            draggable: true,
            image: charaImageUrl
          }"
        />
      </v-layer>
      <v-layer
        ref="layer">
        <v-text
          :config="{
            text: 'ヒメ',
            fontSize: 100,
            fontFamily: 'source-han-sans-japanese',
            fontWeight: 900,
            x: 300,
            y: 77,
            draggable: true,
            stroke: '#050505',
            strokeWidth: 4,
            rotation: 11,
            fill: '#E2E2E2'
          }"
        />
      </v-layer>
    </v-stage>
    <div>
      ヒメ
    </div>
    <img id="image_png">
  </div>
</template>

<script>
import CharaImage from '~/assets/images/hime.png'

export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    aspectRatio: {
      type: Number,
      required: true
    },
    backgroundImage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      charaImageUrl: null,
      backgroundImageUrl: null
    }
  },
  computed: {
    height() {
      return this.width * this.aspectRatio
    }
  },
  created() {
    if (process.browser) {
      const backgroundImage = new Image()
      backgroundImage.src = this.backgroundImage
      backgroundImage.onload = () => {
        // set image only when it is loaded
        this.backgroundImageUrl = backgroundImage
      }

      const charaImage = new Image()
      charaImage.src = CharaImage
      charaImage.onload = () => {
        this.charaImageUrl = charaImage
      }
    }
  },
  methods: {
    saveAsImage(e) {
      const stage = e.target.getStage()
      document.getElementById('image_png').src = stage.toDataURL()
    }
  }
}
</script>

<style>
#root {
  color: red;
  font-family: 'source-han-sans-japanese';
  font-size: 90px;
}
</style>
