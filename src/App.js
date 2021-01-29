import React, { useState, useEffect, useMemo } from "react";

import { ThemeProvider } from "emotion-theming";
import styled from "@emotion/styled";

import { getMoment } from "./utils/helpers";
import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import useWeatherAPI from './hooks/useWeatherAPI';

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-D555BCF3-0C1A-470A-A014-D4ECC6E6165B";
const LOCATION_NAME = "臺北";
const LOCATION_NAME_FORECAST = "臺北市";

const App = () => {
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_NAME_FORECAST,
    authorizationKey: AUTHORIZATION_KEY,
  });

  const [currentTheme, setCurrentTheme] = useState("light");
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);
  

  const [currentPage, setCurrentPage] = useState('WeatherCard');

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
        <WeatherSetting />
      </Container>
    </ThemeProvider>
  );
};

export default App;
