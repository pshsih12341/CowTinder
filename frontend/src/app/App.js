import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // Импортируем Provider
import router from './routes';
import store from './redux'; 
import { ConfigProvider } from 'antd';

const App = () => {
  return (
    <ConfigProvider     theme={{
      token:{
        colorPrimary:"#E33535",
      },
      components:{
        Steps:{
          descriptionMaxWidth:110,
          defaultColor:"#E33535",
        },
        Button:{
          defaultBg:"#E33535",
          defaultHoverBg:"#E33535",
          defaultActiveBg:"#E33535",
          defaultActiveBorderColor:"#E33535",
          defaultHoverBorderColor:"#E33535",
          defaultColor:"#FFFFFF",
          textTextColor:"#FFFFFF",
          textTextActiveColor:'#FFFFFF',
          defaultHoverColor:'#FFFFFF',
          defaultActiveColor:'#FFFFFF',
          textTextHoverColor:'#FFFFFF',
          defaultGhostColor:'#E33535'
        }
      },
      Radio:{
        buttonSolidCheckedActiveBg:'#E33535',
        buttonSolidCheckedBg:'#E33535',
        buttonSolidCheckedHoverBg:'#E33535',
        buttonBg:'#E33535',
        Group: {
          buttonSolidCheckedActiveBg:'#E33535',
          buttonSolidCheckedBg:'#E33535',
          buttonSolidCheckedHoverBg:'#E33535',
        }
      },
      RadioGroup:{
        buttonSolidCheckedBg:"#E33535"
      }
    }}>
      <Provider store={store}> {/* Оборачиваем в Provider */}
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
