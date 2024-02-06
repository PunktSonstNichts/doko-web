<template>
    <div id="main">
        <div id="upper"
             :style="{
                            'height': `${Math.max(...pointHistory) / 2}px`
                     }"
        >
            <div v-for="(point, index) in pointHistory" :key="index">
                <div v-if="point > 0"
                     v-bind:style="{
                            'height': `${heights[index]}%`
                     }"
                     class="upper-points">
                </div>
                <div v-else class="empty-space"></div>
            </div>
        </div>
        <div id="zero"></div>
        <div id="downer"
             :style="{
                            'height': `${Math.abs(Math.min(...pointHistory)) / 2}px`
                     }"
        >
            <div v-for="(point, index) in pointHistory" :key="index">
                <div v-if="point < 0"
                     :style="{
                            'height': `${heights[index]}%`
                     }"
                     class="downer-points">
                </div>
                <div v-else class="empty-space"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'UserHistoryUI',
    props: {
        pointHistory: {
            type: Array,
            default: () =>{
                return [];
            }
        }
    },
    data(){
        return {
            heights: []
        }
    },
    created() {
        this.updateHeights();
    },
    watch: {
        pointHistory(){
            this.updateHeights();
        }
    },
    methods: {
        updateHeights(){
            let points = this.pointHistory;
            // points.forEach(element => Math.abs(element));
            //const center = (Math.max(...points) + Math.min(...points)) / 2;
            const min = Math.min(...points);
            const max = Math.max(...points);
            this.heights = points.map(n => Math.abs(this.scale(n, min,max,-100,100)));
            console.log(min, max, this.pointHistory, this.heights);
        },
        scale(number, inMin, inMax, outMin, outMax){
            return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }
    }
}
</script>
<style scoped lang="scss">
@import "@/css/colors.scss";

#main{
    display: flex;
    flex-direction: column;
    font-size: 1rem;
}
#upper, #downer {
    display: flex;
}
#upper > *, #downer > *{
    position: relative;
    flex: 1;
    margin: 2px 1px;
}
.upper-points{
    position: absolute;
    bottom: 0;
    width: 100%;
}

#zero{
    height: 1px;
    background: $secondColorDark;
}
.upper-points, .downer-points{
    background: $secondColorDark;
}
</style>