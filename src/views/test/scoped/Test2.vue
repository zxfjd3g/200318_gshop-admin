<template>
  <div class="test2">
    <h2 class="t2">t2--Test2</h2>
    <h2 class="t22">t22--Test2</h2>
    
    <h2>
      <span>Test2</span>
    </h2>
    
    <br>
    <Test3></Test3>
    <br>
    <Test4/>
  </div>
</template>

<script>
import Test3 from './Test3'
import Test4 from './Test4'
export default {
  name: 'Test2',
  components: {
    Test3,
    Test4
  }
}
</script>