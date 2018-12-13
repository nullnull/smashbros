<template>
  <div id="root">
    <Canvas
      :width="canvasWidth"
      :aspect-ratio="canvasAspectRatio"
      :background-image="backgroundImage"
    />
  </div>
</template>

<script>
import Canvas from '~/components/Canvas'
import backgroundImage from '~/assets/images/sansen2.jpeg'

export default {
  components: {
    Canvas
  },
  data() {
    return {
      backgroundImage: backgroundImage,
      canvasWidth: 600,
      canvasAspectRatio: 0.5661
    }
  }
}
</script>

<style>
</style>
