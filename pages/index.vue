<template lang="pug">
  #root
    h1.uk-padding.uk-text-center.uk-padding-remove-left.uk-padding-remove-right
      | スマブラ参戦風
      br
      | 画像ジェネレーター

    Canvas(
      v-if="isCanvasVisible"
      :width="canvasWidth"
      :height="canvasHeight"
      :background-image="backgroundImage"
      :chara-image="image"
      :name="name"
      :size="parseFloat(size)"
      :font-size="parseInt(fontSize)"
      :event-hub="eventHub"
    )

    form.settings.uk-padding-small.uk-margin-top
      .uk-grid.uk-grid-small(uk-grid)
        .uk-form-custom.uk-text-center.uk-width-1-3
            input(type="file" @change="onFileChanged" accept="image/*" multiple)
            span.plus-circle(uk-icon="icon: plus-circle; ratio: 2.8")
            br
            label.uk-form-label
              | 画像を選択
        .uk-width-2-3
          label.uk-form-label(for="settings-name")
            | 参戦者名
          input#settings-name.uk-input(type="text" placeholder="(例) キングクルール" v-model="name")
        div.uk-margin-small-top
        .uk-margin-small.uk-width-1-1
          .uk-grid.uk-grid-small(uk-grid)
            .uk-width-1-4
              label.uk-form-label(for="settings-image-size")
                | 画像サイズ
            .uk-width-3-4
              input#settings-image-size.uk-range(type="range" min="0" max="2" step="0.001" v-model="size")
        .uk-margin-small.uk-width-1-1
          .uk-grid.uk-grid-small(uk-grid)
            .uk-width-1-4
              label.uk-form-label(for="settings-font-size")
                | 文字サイズ
            .uk-width-3-4
              input#settings-font-size.uk-range(type="range" min="40" max="120" step="5" v-model="fontSize")
        .uk-width-1-1.uk-text-center
          span.uk-button(@click="saveAsImage")
            span(uk-icon="icon: download; ratio: 1.5")
            | 画像を保存
</template>

<script>
import Canvas from '~/components/Canvas'
import backgroundImage from '~/assets/images/sansen2.jpeg'
import UIkit from 'uikit'
import Vue from 'vue'

export default {
  components: {
    Canvas
  },
  data() {
    const canvasWidth = Math.min(600, window.innerWidth)
    return {
      backgroundImage: backgroundImage,
      canvasWidth: canvasWidth,
      canvasAspectRatio: 0.5661,
      eventHub: new Vue(),
      name: '',
      size: 1,
      fontSize: 60 + canvasWidth / 300,
      image: null,
      isCanvasVisible: false
    }
  },
  computed: {
    canvasHeight() {
      return this.canvasWidth * this.canvasAspectRatio
    }
  },
  created() {
    this.fetchFont(document)
    setTimeout(() => {
      this.isCanvasVisible = true
    }, 500)
  },
  methods: {
    saveAsImage() {
      this.eventHub.$emit('saveAsImage')
    },
    fetchFont(d) {
      var config = {
          kitId: 'lfl6jjo',
          scriptTimeout: 3000,
          async: true
        },
        h = d.documentElement,
        t = setTimeout(function() {
          h.className =
            h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive'
        }, config.scriptTimeout),
        tk = d.createElement('script'),
        f = false,
        s = d.getElementsByTagName('script')[0],
        a
      h.className += ' wf-loading'
      tk.src = 'https://use.typekit.net/' + config.kitId + '.js'
      tk.async = true
      tk.onload = tk.onreadystatechange = function() {
        a = this.readyState
        if (f || (a && a != 'complete' && a != 'loaded')) return
        f = true
        clearTimeout(t)
        try {
          Typekit.load(config)
        } catch (e) {}
      }
      s.parentNode.insertBefore(tk, s)
    },
    onFileChanged(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()
        img.src = window.URL.createObjectURL(file)

        img.onload = () => {
          this.size = Math.min(
            (this.canvasWidth * 0.7) / img.width,
            this.canvasHeight / img.height
          )
          this.image = img
          return
        }
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style>
</style>
