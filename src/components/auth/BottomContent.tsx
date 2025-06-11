import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme,
  styled,
  Typography,
  Link,
  Button,
} from "@mui/material";
export const BottomContent = ({activeTab,setActiveTab}:{activeTab:number,setActiveTab:any}) => {
  return (
    <div> 
          {activeTab == 0 ? (
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  onClick={() => setActiveTab(1)}
                  sx={{ textTransform: "none", padding: 0 }}
                >
                  <Link underline="hover" fontWeight="bold">
                    Register
                  </Link>
                </Button>
              </Typography>
            </Box>
          ) : (
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button
                  onClick={() => setActiveTab(0)}
                  sx={{ textTransform: "none", padding: 0 }}
                >
                  <Link underline="hover" fontWeight="bold">
                    Sign In
                  </Link>
                </Button>
              </Typography>
            </Box>
          )}
    </div>
  )
}
