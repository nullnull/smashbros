<template lang="pug">
  #root
    h1.uk-padding.uk-text-center.uk-padding-remove-left.uk-padding-remove-right
      | スマブラ参戦
      br
      | ジェネレーター

    .uk-flex.uk-flex-center
      Canvas(
        v-if="isCanvasVisible"
        :width="canvasWidth"
        :height="canvasHeight"
        :background-config="backgroundConfig"
        :background-image="backgroundConfig.image"
        :chara-image="image"
        :name="name"
        :size="parseFloat(size)"
        :font-size="parseInt(fontSize)"
        :event-hub="eventHub"
      )

    form.settings.uk-padding-small.uk-margin-top
      .uk-grid(uk-grid)
        .uk-form-custom.uk-text-center.uk-width-1-5
            input(type="file" @change="onFileChanged" accept="image/*" multiple)
            span.plus-circle(uk-icon="icon: plus-circle; ratio: 2.8")
            br
            label.uk-form-label
              | 画像選択
        .uk-text-center.uk-width-1-5(@click="toggleBackground")
            span.refresh(uk-icon="icon: refresh; ratio: 2.8")
            br
            label.uk-form-label
              | 背景切替
        .uk-width-3-5
          label.uk-form-label(for="settings-name")
            | 参戦者名
          input#settings-name.uk-input(type="text" placeholder="キングクルール" v-model="name")
        div.uk-margin-small-top
        .uk-margin-small.uk-width-1-1
          .uk-grid.uk-grid-small(uk-grid)
            .uk-width-1-4
              label.uk-form-label(for="settings-image-size")
                | 画像サイズ
            .uk-width-3-4
              input#settings-image-size.uk-range(type="range" min="0" max="1.5" step="0.001" v-model="size")
        .uk-margin-small.uk-width-1-1
          .uk-grid.uk-grid-small(uk-grid)
            .uk-width-1-4
              label.uk-form-label(for="settings-font-size")
                | 文字サイズ
            .uk-width-3-4
              input#settings-font-size.uk-range(type="range" min="40" max="300" step="5" v-model="fontSize")
        .uk-width-1-1.uk-text-center
          p.uk-text-small
            | 画像・文字はドラッグすると移動できます
        .uk-width-1-1.uk-text-center
          span.uk-button(@click="saveAsImage" uk-toggle="target: #modal")
            span(uk-icon="icon: download; ratio: 1.5")
            | 画像を保存
        .uk-width-1-1.uk-margin-large-top.uk-text-center
          hr.uk-divider-icon
        .uk-width-1-1.uk-text-center
          a(href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false")
            | Tweet
          script(async src="https://platform.twitter.com/widgets.js" charset="utf-8")
        .uk-width-1-1.uk-text-center.footer
          p
            | 素材提供 :
            a(href="http://seiga.nicovideo.jp/seiga/im3183807")
              | reaさん

    #modal.uk-flex-top(uk-modal)
      .uk-modal-dialog.uk-margin-auto-vertical
        button.uk-modal-close-default(type="button" uk-close)
        img#output-image
        p.modal-text.uk-text-center
          | 生成完了！
          br
          template(v-if="isSp()")
            | 長押しして保存してください
          template(v-else)
            | 画像を保存しました。
</template>

<script>
import Canvas from '~/components/Canvas'
import backgroundImage1 from '~/assets/images/background1.jpg'
import backgroundImage2 from '~/assets/images/background2.jpg'
import backgroundImage3 from '~/assets/images/background3.jpg'
import UIkit from 'uikit'
import Vue from 'vue'

export default {
  components: {
    Canvas
  },
  data() {
    const canvasWidth = Math.min(600, window.innerWidth)
    return {
      backgroundIdx: 0,
      canvasWidth: canvasWidth,
      canvasAspectRatio: 0.5661,
      eventHub: new Vue(),
      name: '',
      size: 1,
      fontSize: this.isSp() ? 90 : 140,
      image: null,
      isCanvasVisible: false
    }
  },
  computed: {
    backgroundConfigs() {
      return [
        {
          textRotation: 11,
          textX: this.canvasWidth / 2,
          textY: this.canvasHeight / 5,
          imageX: this.canvasWidth / 10,
          imageY: this.canvasHeight / 30,
          image: backgroundImage1
        },
        {
          textRotation: 4,
          textX: this.canvasWidth / 10,
          textY: this.canvasHeight / 30,
          imageX: this.canvasWidth / 1.7,
          imageY: this.canvasHeight / 30,
          image: backgroundImage2
        },
        {
          textRotation: 4,
          textX: this.canvasWidth / 10,
          textY: this.canvasHeight / 30,
          imageX: this.canvasWidth / 1.8,
          imageY: this.canvasHeight / 30,
          image: backgroundImage3
        }
      ]
    },
    backgroundConfig() {
      return this.backgroundConfigs[this.backgroundIdx]
    },
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
    toggleBackground() {
      this.backgroundIdx = (this.backgroundIdx + 1) % 3
    },
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
.modal-text {
  color: #030303;
}
#root {
  max-width: 600px;
  margin: auto;
}
</style>
