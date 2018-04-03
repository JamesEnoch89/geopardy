const BASE_URL = "http://jservice.io/api/";

angular
  .module("mainApp", [])
  .controller("mainController", ["$scope", "$http", ($scope, $http) => {
    $scope.values = [200, 400, 600, 800, 1000]

    $scope.playAgain = () => {
      $scope.playAgainShow = false
      $scope.clueCounter = 0

      $scope.jeoPlayer = {
        name: "",
        score: 0
      }

      $http({
        url: BASE_URL + "/random?count=5"
      }).then(response => {
        console.log(response)
        console.log(response.data)
        $scope.categories = response.data.map(c => c.category)
      }).then(() => {
        let usedIds = []
        $scope.wagers = []
        $scope.values.forEach((value, i) => {
          let wager = {
            value: value,
            clues: []
          }
          $scope.wagers.push(wager)
          $scope.categories.forEach((category, j) => {
            $http({
              url: BASE_URL + `/clues?category=${category.id}`
            }).then(response => {
              console.log("clues", response.data)
              const clue = response.data.filter(c => c.value >= value && usedIds.indexOf(c.id) === -1)[0]
              usedIds.push(clue.id)
              $scope.wagers[i].clues[j] = clue
            })

          })

        })

      })
    }
    $scope.playAgain()
    $scope.hideClue = (clue) => {
      $scope.clueCounter++
      if ($scope.clueCounter === 25) {
        $scope.playAgainShow = true
      }
      $scope.wagers.forEach((wager, i) => {
        wager.clues.forEach((c, j) => {
          if (c.id === clue.id) {
            $scope.wagers[i].clues[j].hide = true
            console.log(, clue)
          }
        })
      })
    }
    $scope.showClue = false
    $scope.checkAnswer = () => {
      $scope.showClue = false
      if ($scope.jeoClue.answer.toLowerCase() === $scope.answer.toLowerCase()) {
        $scope.jeoPlayer.score += $scope.jeoWager
      } else {
        $scope.jeoPlayer.score -= $scope.jeoWager
      }
      $scope.answer = ""
    }
  }])