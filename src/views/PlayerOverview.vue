<template>
  <div>
      <span>
          Du gewinnst 54% deiner Spiele.
          Bei einem Erwartungswert von 50% liegst du innerhalb x% aller Spieler:innen.
          </span>
    <h1>Übersicht deiner Gruppen</h1>
    <loading v-if="loading"></loading>
    <div v-else id="list-of-groups">
      <div v-for="(spielgruppen) in auswertung" :key="spielgruppen.id" class="group">
        <div>
          <div class="group-players">
            <span v-for="(spieler) in spielgruppen.spieler" :key="spieler.id">
              {{spieler.name}}
            </span>
          </div>
          <span class="group-last-game">
            zuletzt {{'vor drei Tagen'}} gezockt
          </span>
        </div>
        <div class="group-rounds-count">
            <div>
                {{ spielgruppen.rundenCount }}
            </div>
            <span>Abende</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/modules/Loading";
//import axios from "axios";

export default {
  name: "GameOverview",
  components: {Loading},
  computed: {
    gameID () {
      return this.$route.params.id
    },
  },
  created() {
    // todo put in axios get response handler
      console.log(typeof this. auswertung, this.auswertung);
      this.auswertung = Object.values(this.auswertung);
      console.log(typeof this. auswertung, this.auswertung);
      this.auswertung.sort(
          (objA, objB) => Number(objB.rundenCount) - Number(objA.rundenCount),
      );
      this.auswertung.forEach(elem => Object.values(elem).sort(
          (objA, objB) => Number(objB.position) - Number(objA.position),
      ));
    /* axios.get(`${this.$hostname}/stats/groups`).then(result => {
      this.loading = false;
      if(!result.data){
        // todo error handling
      }
      console.log(result);
      this.auswertung = result.data.auswertung;
      this.gameFound = true;
    }).catch(error => {
      console.error(error);
      this.loading = false;
      this.gameFound = false;
    }); */
  },
  data(){
    return {
      loading: false,
        auswertung: {
            "[2, 7, 8, 9]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -15,
                        "position": 3
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": 33,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -41,
                        "position": 4
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": 23,
                        "position": 2
                    }
                },
                "rundenCount": 48
            },
            "[2, 8, 10, 11, 12]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -3,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -3,
                        "position": 4
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 0,
                        "position": 3
                    },
                    "11": {
                        "id": 11,
                        "name": "Theresa",
                        "punkte": 3,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 3,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[2, 6, 7, 8, 9]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 0,
                        "position": 3
                    },
                    "6": {
                        "id": 6,
                        "name": "Jan",
                        "punkte": 5,
                        "position": 1
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": -5,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 5,
                        "position": 1
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": -5,
                        "position": 4
                    }
                },
                "rundenCount": 1
            },
            "[2, 8, 13, 14]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -1,
                        "position": 3
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 1,
                        "position": 1
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -1,
                        "position": 3
                    },
                    "14": {
                        "id": 14,
                        "name": "Miri",
                        "punkte": 1,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[2, 8, 12, 13]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 21,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -7,
                        "position": 2
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -7,
                        "position": 2
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -7,
                        "position": 2
                    }
                },
                "rundenCount": 4
            },
            "[2, 8, 12, 15]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 5,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 5,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -5,
                        "position": 3
                    },
                    "15": {
                        "id": 15,
                        "name": "Nico",
                        "punkte": -5,
                        "position": 3
                    }
                },
                "rundenCount": 1
            },
            "[2, 8, 13, 15]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -5,
                        "position": 3
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 5,
                        "position": 1
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": 5,
                        "position": 1
                    },
                    "15": {
                        "id": 15,
                        "name": "Nico",
                        "punkte": -5,
                        "position": 3
                    }
                },
                "rundenCount": 1
            },
            "[8, 9, 12, 13]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 8,
                        "position": 1
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": -8,
                        "position": 3
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 8,
                        "position": 1
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -8,
                        "position": 3
                    }
                },
                "rundenCount": 1
            },
            "[8, 10, 12, 13]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -14,
                        "position": 4
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 12,
                        "position": 2
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 14,
                        "position": 1
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -12,
                        "position": 3
                    }
                },
                "rundenCount": 7
            },
            "[2, 8, 10, 12, 13]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -15,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 21,
                        "position": 1
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 7,
                        "position": 2
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 7,
                        "position": 2
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -20,
                        "position": 5
                    }
                },
                "rundenCount": 6
            },
            "[2, 7, 8, 9, 13]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -3,
                        "position": 4
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": -3,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 3,
                        "position": 1
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": 0,
                        "position": 3
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": 3,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[8, 12, 13, 19]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -7,
                        "position": 3
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -7,
                        "position": 3
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": 7,
                        "position": 1
                    },
                    "19": {
                        "id": 19,
                        "name": "Alexandre",
                        "punkte": 7,
                        "position": 1
                    }
                },
                "rundenCount": 2
            },
            "[2, 6, 8, 24]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -4,
                        "position": 3
                    },
                    "6": {
                        "id": 6,
                        "name": "Jan",
                        "punkte": 4,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -4,
                        "position": 3
                    },
                    "24": {
                        "id": 24,
                        "name": "Kay",
                        "punkte": 4,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[2, 7, 8, 9, 18]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -10,
                        "position": 5
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": 10,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -2,
                        "position": 3
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": 6,
                        "position": 2
                    },
                    "18": {
                        "id": 18,
                        "name": "Daniel",
                        "punkte": -4,
                        "position": 4
                    }
                },
                "rundenCount": 2
            },
            "[2, 6, 8, 25]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 3,
                        "position": 2
                    },
                    "6": {
                        "id": 6,
                        "name": "Jan",
                        "punkte": 11,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -3,
                        "position": 3
                    },
                    "25": {
                        "id": 25,
                        "name": "Carla",
                        "punkte": -11,
                        "position": 4
                    }
                },
                "rundenCount": 2
            },
            "[2, 8, 27, 28]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 12,
                        "position": 2
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -22,
                        "position": 4
                    },
                    "27": {
                        "id": 27,
                        "name": "Regine",
                        "punkte": -6,
                        "position": 3
                    },
                    "28": {
                        "id": 28,
                        "name": "Inken",
                        "punkte": 16,
                        "position": 1
                    }
                },
                "rundenCount": 9
            },
            "[2, 8, 10, 12]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 7,
                        "position": 2
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 15,
                        "position": 1
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": -15,
                        "position": 4
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -7,
                        "position": 3
                    }
                },
                "rundenCount": 3
            },
            "[2, 7, 8, 30]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 7,
                        "position": 1
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": -7,
                        "position": 3
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -7,
                        "position": 3
                    },
                    "30": {
                        "id": 30,
                        "name": "Carl",
                        "punkte": 7,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[7, 8, 9, 10]": {
                "spieler": {
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": 5,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -5,
                        "position": 3
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": -5,
                        "position": 3
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 5,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[2, 8, 9, 12]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -5,
                        "position": 3
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 5,
                        "position": 1
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": -5,
                        "position": 3
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 5,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[2, 7, 8, 9, 12]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 0,
                        "position": 3
                    },
                    "7": {
                        "id": 7,
                        "name": "Jannis",
                        "punkte": -10,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -10,
                        "position": 4
                    },
                    "9": {
                        "id": 9,
                        "name": "Tabi",
                        "punkte": 10,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 10,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[8, 28, 33, 34]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -4,
                        "position": 3
                    },
                    "28": {
                        "id": 28,
                        "name": "Inken",
                        "punkte": 4,
                        "position": 1
                    },
                    "33": {
                        "id": 33,
                        "name": "Stephan",
                        "punkte": 4,
                        "position": 1
                    },
                    "34": {
                        "id": 34,
                        "name": "Neele",
                        "punkte": -4,
                        "position": 3
                    }
                },
                "rundenCount": 1
            },
            "[8, 12, 13, 32, 38]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 6,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 0,
                        "position": 3
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -6,
                        "position": 4
                    },
                    "32": {
                        "id": 32,
                        "name": "Timur",
                        "punkte": 6,
                        "position": 1
                    },
                    "38": {
                        "id": 38,
                        "name": "Temur",
                        "punkte": -6,
                        "position": 4
                    }
                },
                "rundenCount": 1
            },
            "[8, 12, 32, 38]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -8,
                        "position": 3
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -8,
                        "position": 3
                    },
                    "32": {
                        "id": 32,
                        "name": "Timur",
                        "punkte": 8,
                        "position": 1
                    },
                    "38": {
                        "id": 38,
                        "name": "Temur",
                        "punkte": 8,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[8, 10, 32, 38]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": -7,
                        "position": 3
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 7,
                        "position": 1
                    },
                    "32": {
                        "id": 32,
                        "name": "Timur",
                        "punkte": -7,
                        "position": 3
                    },
                    "38": {
                        "id": 38,
                        "name": "Temur",
                        "punkte": 7,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[8, 10, 12, 13, 38]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 10,
                        "position": 1
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 10,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -10,
                        "position": 4
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -10,
                        "position": 4
                    },
                    "38": {
                        "id": 38,
                        "name": "Temur",
                        "punkte": 0,
                        "position": 3
                    }
                },
                "rundenCount": 3
            },
            "[2, 8, 12, 13, 32]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": -5,
                        "position": 4
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 0,
                        "position": 3
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -5,
                        "position": 4
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": 5,
                        "position": 1
                    },
                    "32": {
                        "id": 32,
                        "name": "Timur",
                        "punkte": 5,
                        "position": 1
                    }
                },
                "rundenCount": 1
            },
            "[8, 10, 12, 38]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 6,
                        "position": 1
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 6,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -6,
                        "position": 3
                    },
                    "38": {
                        "id": 38,
                        "name": "Temur",
                        "punkte": -6,
                        "position": 3
                    }
                },
                "rundenCount": 1
            },
            "[2, 8, 10, 12, 37]": {
                "spieler": {
                    "2": {
                        "id": 2,
                        "name": "Till",
                        "punkte": 7,
                        "position": 1
                    },
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 0,
                        "position": 3
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 7,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": -7,
                        "position": 4
                    },
                    "37": {
                        "id": 37,
                        "name": "Lennart",
                        "punkte": -7,
                        "position": 4
                    }
                },
                "rundenCount": 1
            },
            "[8, 10, 12, 13, 32]": {
                "spieler": {
                    "8": {
                        "id": 8,
                        "name": "Malte",
                        "punkte": 3,
                        "position": 1
                    },
                    "10": {
                        "id": 10,
                        "name": "Thibaud",
                        "punkte": 3,
                        "position": 1
                    },
                    "12": {
                        "id": 12,
                        "name": "Alex",
                        "punkte": 0,
                        "position": 3
                    },
                    "13": {
                        "id": 13,
                        "name": "Tete",
                        "punkte": -3,
                        "position": 4
                    },
                    "32": {
                        "id": 32,
                        "name": "Timur",
                        "punkte": -3,
                        "position": 4
                    }
                },
                "rundenCount": 1
            }
        }
    }
  },
  methods: {
    pointsPerRound(runde){
      let result = [];
      this.spieler.forEach(spieler => {
        const player = runde.spielerArray.find(player => player.id === spieler.id);
        if(player){
          console.log(player, player.zwischenstand);
          result.push({punkte: player.zwischenstand, solo: player.id === runde.solo});
        }else{
          result.push({punkte: "-/-"});
        }
      });
      console.log(result);
      return result;
    },
  }
}
</script>

<style scoped>
h1{
  text-align: center;
}
.group{
    margin: 14px 6px;
    border: 1px solid #1f2a34;
    border-radius: 8px 3px 12px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    box-shadow: 0 1px 4px -2px #1f2a34;
    transition: box-shadow 0.25s cubic-bezier(0.66, 0.13, 0.4, 0.99);
}
.group:hover{
    box-shadow: 0 2px 12px -4px #1f2a34;
}
.group > *{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 9px 11px;
}
.group-players{
    font-size: 1.2em;
}
.group-last-game{
    color: #2c3e50;
}
.group-rounds-count{
    border-left: 1px solid #1f2a34;
    box-shadow: inset 0 2px 11px -4px #1f2a34;
    background: #2c3e50;
    color: #42b983;
    border-radius: 0 2px 11px 0;
    align-items: center;
}
.group-rounds-count > div{
    font-weight: bold;
    font-size: 1.6em;
    text-shadow: 1px 1px 0 #206042;
}
</style>