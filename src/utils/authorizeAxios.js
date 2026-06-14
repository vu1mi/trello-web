import axios from "axios";
import { toast } from "react-toastify";
import {interceptorLoadingElement} from "./formatter";
import {refreshTokenAPI} from '~/apis/index';
import {selectUserData , logout} from '~/redux/user/userSlice';

// const navigate = useNavigate();
let axiosReduxStore 
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
}
const authorizeAxios = axios.create();
//thoi gian cho cua request 
authorizeAxios.defaults.timeout = 1000*60*10; // 10 seconds
authorizeAxios.defaults.withCredentials = true; // cho phép gửi cookie cùng với yêu cầu

// cau hinh intercepto cho request 
authorizeAxios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token"); // Lấy token từ localStorage
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header
    // }
    interceptorLoadingElement(true);
    return config;
  },
  (error) => {
    interceptorLoadingElement(false);
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null; // Biến để theo dõi trạng thái refresh token

// cau hinh interceptor cho response
authorizeAxios.interceptors.response.use(
  (response) => {
    interceptorLoadingElement(false);
    return response;
  },   
    (error) => {
    interceptorLoadingElement(false);
      if(error.response?.status === 401) { 
        axiosReduxStore.dispatch(logout());
        return Promise.reject(error);
      }
      const originalRequest = error.config
      console.log('originalRequest', originalRequest)
      if(error.response?.status === 410 && !originalRequest._retry){

        // them retry = true để chắc rằng chỉ gọi refresh 1 lần duy nhất trong thời gian chờ
        
        if(!refreshTokenPromise){
          refreshTokenPromise = refreshTokenAPI()
            .then((data) =>{
              return data?.accessToken
            }
            )
            .catch(()=>{
              axiosReduxStore.dispatch(logout())
              return Promise.reject(error);
            }
            )
            .finally(() => {
                refreshTokenPromise = null;
              }
            )
        }
        originalRequest._retry = true


        return refreshTokenPromise.then(
          (accessToken) =>{
            return authorizeAxios(originalRequest)
          }
        )
      }

        let errorMessage = error.response  
        if( error.response?.data?.message) {
            errorMessage = error.response?.data?.message
        }
        console.error("API Error:", error.response.status);
    if (error.response.status !== 401) {
     toast.error(errorMessage || "An error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);


export default authorizeAxios;