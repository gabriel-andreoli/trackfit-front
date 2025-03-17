class Endpoints {
  public static API_URL: string = "https://localhost:7076/";
  public static LOGIN: string = this.API_URL + "api/Auth/login";
  public static REGISTER: string = this.API_URL + "api/Auth/register";

  public static WORKOUT: string = this.API_URL + "api/v1/workout/";
  public static EXERCISE: string = this.API_URL + "api/v1/exercise/";
}

export default Endpoints;