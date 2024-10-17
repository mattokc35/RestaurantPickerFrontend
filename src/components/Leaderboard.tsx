import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Player } from "../types/types";


interface LeaderboardProps {
  scores: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  scores,
}: LeaderboardProps) => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "auto" }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ textAlign: "center", my: 3 }}
      >
        Leaderboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell>Username</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((row, index) => (
            <TableRow key={row.username}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
