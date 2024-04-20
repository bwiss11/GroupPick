import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { Team } from "./Team";

const Game = (props) => {
//   console.log("game props", props);
  let myTime = new Date(props.time);
  return (
    <View style={styles.container}>
      <View style={styles.timeHolder}>
        <Text style={styles.time}>
          {myTime.toLocaleTimeString([], {
            timeStyle: "short",
          })}
        </Text>
      </View>
      <View style={styles.teamsContainer}>
        <Team
          teamType="away"
          teamID={props.awayTeamID}
          team={props.awayTeam}
          wins={props.awayTeamWins}
          losses={props.awayTeamLosses}
          starter={props.awayStarter}
          starterID={props.awayStarterPlayerID}
        />
        <Team
          teamType="home"
          teamID={props.homeTeamID}
          team={props.homeTeam}
          wins={props.homeTeamWins}
          losses={props.homeTeamLosses}
          starter={props.homeStarter}
          starterID={props.homeStarterPlayerID}
        />
      </View>
      <PickOptions
        homeML={props.homeML}
        awayML={props.awayML}
        homeSpread={props.homeSpread}
        awaySpread={props.awaySpread}
        homeSpreadOdds={props.homeSpreadOdds}
        awaySpreadOdds={props.awaySpreadOdds}
        total={props.total}
        over={props.over}
        under={props.under}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 900,
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    borderColor: "black",
    borderWidth: 4,
    overflow: "hide",
  },
  time: {
    padding: 5,
  },
  recordsContainer: {
    flexDirection: "row",
  },
  records: {
    paddingRight: 100,
  },
  teamsContainer: {
    flexDirection: "row",
  },
  awayTeam: {
    rightBorderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
  },
});

export { Game };