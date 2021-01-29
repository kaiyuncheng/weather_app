import { useState, useEffect, useCallback } from 'react';


const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
  
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
  
        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
        };
      });
  };
  
  const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );
  
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      });
  };


  const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: "",
        temperature: 0,
        windSpeed: 0,
        description: "",
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: "",
        isLoading: true,
      });

      const fetchData = useCallback(async () => {
        setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
    
        const [currentWeather, weatherForecast] = await Promise.all([
          fetchCurrentWeather({ authorizationKey, locationName }),
          fetchWeatherForecast({ authorizationKey, cityName }),
        ]);
    
        setWeatherElement({
          ...currentWeather,
          ...weatherForecast,
          isLoading: false,
        });
      }, [authorizationKey, cityName, locationName]);
    
      // const fetchData = async () => {
      //   setWeatherElement((prevState) => ({
      //     ...prevState,
      //     isLoading: true,
      //   }));
    
      //   const [currentWeather, weatherForecast] = await Promise.all([
      //     fetchCurrentWeather(),
      //     fetchWeatherForecast(),
      //   ]);
    
      //   setWeatherElement({
      //     ...currentWeather,
      //     ...weatherForecast,
      //     isLoading: false,
      //   });
      // };
    
      useEffect(() => {
        fetchData();
      }, [fetchData]);
    
      // const fetchWeatherForecast = () => {
      //   fetch(
      //     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
      //   )
      //     .then((response) => response.json())
      //     .then((data) => {
      //       const locationData = data.records.location[0];
      //       const weatherElements = locationData.weatherElement.reduce(
      //         (neededElements, item) => {
      //           // 只保留需要用到的「天氣現象」、「降雨機率」和「舒適度」
      //           if (["Wx", "PoP", "CI"].includes(item.elementName)) {
      //             // 這支 API 會回傳未來 36 小時的資料，這裡只需要取出最近 12 小時的資料，因此使用 item.time[0]
      //             neededElements[item.elementName] = item.time[0].parameter;
      //           }
      //           return neededElements;
      //         },
      //         {}
      //       );
      //       console.log(weatherElements);
    
      //       setWeatherElement((prevState) => ({
      //         ...prevState,
      //         description: weatherElements.Wx.parameterName,
      //         weatherCode: weatherElements.Wx.parameterValue,
      //         rainPossibility: weatherElements.PoP.parameterName,
      //         comfortability: weatherElements.CI.parameterName,
      //       }));
      //     });
      // };
    
      // const fetchCurrentWeather = () => {
      //   setWeatherElement((prevState) => ({
      //     ...prevState,
      //     isLoading: true,
      //   }));
    
      //   fetch(
      //     `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
      //   )
      //     .then((res) => res.json())
      //     .then((data) => {
      //       const locationData = data.records.location[0];
      //       const weatherElements = {};
      //       locationData.weatherElement.forEach((item) => {
      //         if (["WDSD", "TEMP"].includes(item.elementName)) {
      //           weatherElements[item.elementName] = item.elementValue;
      //         }
      //       });
      //       console.log(locationData);
      //       console.log(weatherElements);
    
      //       setWeatherElement((prevState) => ({
      //         ...prevState,
      //         observationTime: locationData.time.obsTime,
      //         locationName: locationData.locationName,
      //         temperature: weatherElements.TEMP,
      //         windSpeed: weatherElements.WDSD,
      //         isLoading: false,
      //       }));
    
      //       // const weatherElements = locationData.weatherElement.reduce((neededElements, item)=>{
      //       //   if(['WDSD', 'TEMP'].includes(item.elementName)){
      //       //     neededElements[item.elementName] = item.elementValue;
      //       //   }
      //       //   return neededElements;
      //       // },{})
      //       // console.log(weatherElements);
      //     });
      // };
    

  return [weatherElement, fetchData];
};

export default useWeatherAPI;