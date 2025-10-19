import { httpService } from "./httpService";

export const getRewardsService = (
  id = null,
  mode = "",
  username = "",
  number = 500,
  page = 1
) => {
  if (id) {
    return httpService(
      `/req/getLastRewards/?id=${id}&mode=${mode}&username=${username}&page=${page}&number=${number}`,
      "get"
    );
  } else {
    return httpService(
      `/req/getLastRewards/?mode=${mode}&page=${page}&number=${number}`,
      "get"
    );
  }
};
export const getRewardsServicePass = (
  id = null,
  mode = "",
  username = "",
  number = 500
) => {

    return httpService(
      `/req/getTopGPass`,
      "get"
    );
 
};
