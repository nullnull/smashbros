<template>
  <div id="root">
    <v-stage
      ref="stage"
      :config="{
        width: width,
        height: height,
    }">
      <v-layer
        ref="layerBackground"
      >
        <v-image
          :config="{
            image: backgroundImageUrl,
            width: width,
            height: height
          }"
        />
      </v-layer>
      <v-layer
        v-if="charaImage != null"
        ref="layerCharacter">
        <v-image
          :config="{
            draggable: true,
            image: charaImage,
            x: backgroundConfig.imageX,
            y: backgroundConfig.imageY,
            scale: { x: size, y : size }
          }"
        />
      </v-layer>
      <v-layer
        v-if="name != ''"
        ref="layerText">
        <v-text
          :config="{
            text: name,
            fontSize: fontSize,
            fontFamily: 'source-han-sans-japanese',
            fontWeight: 900,
            x: backgroundConfig.textX,
            y: backgroundConfig.textY,
            draggable: true,
            stroke: '#050505',
            strokeWidth: 4,
            rotation: backgroundConfig.textRotation,
            fill: '#E2E2E2'
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    eventHub: {
      required: true,
      type: Vue
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    backgroundConfig: {
      type: Object,
      required: true
    },
    backgroundImage: {
      type: String,
      required: true
    },
    charaImage: {
      type: HTMLImageElement,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    fontSize: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      charaImageUrl: null,
      backgroundImageUrl: null
    }
  },
  watch: {
    backgroundImage(_a, _b) {
      this.loadBackgroundImage()
    }
  },
  mounted() {
    if (process.browser) {
      this.eventHub.$on('saveAsImage', this.saveAsImage)
      this.loadBackgroundImage()
    }
  },
  methods: {
    loadBackgroundImage() {
      const backgroundImage = new Image()
      backgroundImage.src = this.backgroundImage
      backgroundImage.onload = () => {
        // set image only when it is loaded
        this.backgroundImageUrl = backgroundImage
      }
    },
    resizeCanvas(scale) {
      const stage = this.$refs.stage.getStage()
      stage.width(this.width * scale)
      stage.height(this.height * scale)
      stage.scale({ x: scale, y: scale })
      stage.draw()
    },
    saveAsImage(e) {
      this.resizeCanvas(3) // To enable download high resolution image
      const url = this.$refs.stage.getStage().toDataURL()
      this.resizeCanvas(1)

      document.getElementById('output-image').src = url
      if (!this.isSp()) {
        this.downloadURI(url, 'smashbros.png')
      }
    },
    downloadURI(uri, name) {
      const link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // delete link;
    }
  }
}
</script>

<style>
#settings-name {
  margin-top: 4px;
}
</style>
