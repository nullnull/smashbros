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
          ref="backgroundImage"
          :config="{
            image: backgroundImageUrl,
            width: width,
            height: height
          }"
        />
      </v-layer>
      <v-layer
        ref="layerCharacter">
        <v-image
          ref="characterImage"
          :config="{
            draggable: true,
            image: charaImage,
            opacity: 0,
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
      backgroundImageUrl: null
    }
  },
  watch: {
    backgroundImage(_a, _b) {
      this.loadBackgroundImage()
    },
    backgroundImageUrl(_a, _b) {
      this.playBackgroundAnimation()
    },
    charaImage(_a, _b) {
      setTimeout(() => {
        if (this.$refs.backgroundImage) this.playCharacterAnimation()
      }, 40)
      setTimeout(() => {
        const node = this.$refs.characterImage.getNode().opacity(1)
      }, 4000)
    }
  },
  mounted() {
    if (process.browser) {
      this.eventHub.$on('saveAsImage', this.saveAsImage)
      this.loadBackgroundImage()
    }
  },
  methods: {
    playBackgroundAnimation() {
      const duration = 100
      const node = this.$refs.backgroundImage.getNode()
      const anim = new Konva.Animation(function(frame) {
        if (frame.time > duration) {
          return
        }
        const rem = duration - frame.time
        const scale = Math.sin(((rem / duration) * Math.PI) / 3) + 1
        const opacity = -Math.sin(((rem / duration) * Math.PI) / 5) + 1
        node.scale({ x: scale, y: scale })
        node.opacity(opacity)
      }, this.$refs.stage.getStage())
      anim.start()
      setTimeout(() => anim.stop(), duration * 2)
    },
    playCharacterAnimation() {
      const duration = 100
      const node = this.$refs.characterImage.getNode()
      const originalScale = node.attrs.scaleX
      const anim = new Konva.Animation(function(frame) {
        if (frame.time > duration) {
          return
        }
        const rem = duration - frame.time
        const scale = Math.sin(((rem / duration) * Math.PI) / 3) + originalScale
        const opacity = -Math.sin(((rem / duration) * Math.PI) / 10) + 1
        node.scale({ x: scale, y: scale })
        node.opacity(opacity)
      }, this.$refs.stage.getStage())
      anim.start()
      setTimeout(() => anim.stop(), duration * 2)
    },
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
