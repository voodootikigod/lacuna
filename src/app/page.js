"use client";
import Image from "next/image";

// import styles from './page.module.css'
import {
  Button,
  AppShell,
  Center,
  Title,
  NumberInput,
  Space,
  Box,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";

const DAY = 1000 * 60 * 60 * 24;

export default function Home() {
  const [start, setStart] = useState(-1);
  const [lacuna, setLacuna] = useState(28);
  useEffect(() => {
    const start = localStorage.getItem("start");
    if (start && parseInt(start, 10) > 0) {
      setStart(parseInt(start, 10));
    } else {
      setStart(0);
    }
    const lacuna = localStorage.getItem("lacuna");
    if (lacuna && parseInt(lacuna, 10) > 0) {
      setLacuna(parseInt(lacuna, 10));
    } else {
      setLacuna(28);
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => Notification.requestPermission())
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  const daysSince = (start) => {
    if (start == -1) return "Loading...";
    if (start == 0) return "Not Set";
    const now = new Date().getTime();
    const diff = now - start;
    const days = Math.floor(diff / DAY);
    return days % lacuna;
  };

  const resetToDay = (daysFromNow) => {
    return () => {
      const now = new Date().getTime();
      const reset = new Date(now + daysFromNow * DAY).getTime();
      localStorage.setItem("start", reset);
      setStart(reset);
    };
  };

  const dateFn = (date) => {
    if (date == -1) return "Loading...";
    if (date == 0) {
      return "Not Set";
    }
    return new Date(date).toLocaleDateString();
  };
  const headerHeight = 80;

  return (
    <AppShell
      header={{ height: headerHeight }}
      withBorder={true}
      padding={{ base: 10, sm: 15, lg: "xl" }}
    >
      <AppShell.Header>
        <Center h={headerHeight}>
          <Box>
            <Title>Lacuna</Title>
          </Box>
        </Center>
      </AppShell.Header>
      <AppShell.Main>
        <Stack align="center" gap="lg">
          <div>
            <b>Started:</b> {dateFn(start)}
          </div>
          <div>
            <b>Days Since:</b> {daysSince(start)}
          </div>
        </Stack>
        <Space h="xl" />
        <Stack align="center" gap="lg">
          <Button onClick={resetToDay(0)}>Reset To Today</Button>
          <Button onClick={resetToDay(-1)}>Reset To Yesterday</Button>
        </Stack>
        <Space h="xl" />
        <div>
          <Center>
            <NumberInput
              label="Lacuna"
              min={1}
              max={100}
              value={lacuna}
              onChange={(value) => {
                localStorage.setItem("lacuna", value);
                setLacuna(value);
              }}
            />
          </Center>
        </div>
        <Space h="xl" />
      </AppShell.Main>
    </AppShell>
  );
}
