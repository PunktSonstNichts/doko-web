<template>
    <span :title="titleString">{{ timeString }}</span>
</template>

<script>
import { selectUnit } from "@formatjs/intl-utils";

export default {
    name: "HumanReadableTime",
    props: {
        time: {
            type: Date,
            default: () => {
                new Date();
            }
        },
        dateOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            timeString: "irgendwie, irgendwo, irgendwann",
            titleString: "genull nau Uhr",
            rtf: new Intl.RelativeTimeFormat("de", { numeric: "auto" })
        };
    },
    watch: {
        time() {
            if (!this.dateOnly) {
                this.updateTimeString();
            }
        }
    },
    mounted() {
        this.printDate();
        if (!this.dateOnly) {
            this.updateTimeString();
        }
    },
    methods: {
        printDate() {
            this.timeString =
                ("0" + this.time.getDate()).slice(-2) +
                "." +
                ("0" + (this.time.getMonth() + 1)).slice(-2) +
                "." +
                this.time.getFullYear();
        },
        updateTimeString() {
            const diff = selectUnit(this.time);
            switch (diff.unit) {
                case "second":
                    setTimeout(this.updateTimeString, 1000);
                    this.timeString = "vor einigen Sekunden";
                // eslint-disable-next-line no-fallthrough
                case "minute":
                    setTimeout(this.updateTimeString, 1000 * 30);
                // eslint-disable-next-line no-fallthrough
                case "hour":
                    setTimeout(this.updateTimeString, 1000 * 60 * 30);
                // eslint-disable-next-line no-fallthrough
                case "day":
                case "week":
                    // don't update updateTimeString
                    // if any of the above -> no break; in end of condition before
                    this.timeString = this.rtf.format(diff.value, diff.unit);
                    break;
            }
            this.titleString = this.time.toUTCString();
        }
    }
};
</script>

<style scoped></style>
