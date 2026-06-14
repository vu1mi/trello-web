import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

const NotFound = () => {
  // Hàm xử lý quay lại trang chủ bằng window.location (Không phụ thuộc React Router Link)
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #141b29 0%, #0c101b 100%)',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        px: 2,
        fontFamily: 'Roboto, sans-serif',
        // Khai báo CSS Animation truyền thống ngay trong MUI sx
        '@keyframes floatAnimation': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes pulseGlow': {
          '0%': { transform: 'scale(1)', opacity: 0.2 },
          '50%': { transform: 'scale(1.2)', opacity: 0.4 },
          '100%': { transform: 'scale(1)', opacity: 0.2 },
        }
      }}
    >
      {/* Đốm sáng nền Pulse tự động */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '15%',
          animation: 'pulseGlow 8s infinite ease-in-out',
          zIndex: 0
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 1, textAlign: 'center' }}>
        {/* Số 404 lớn với hiệu ứng bay bồng bềnh */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '7rem', sm: '10rem', md: '12rem' },
            fontWeight: 900,
            background: 'linear-gradient(45deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.2rem',
            animation: 'floatAnimation 4s infinite ease-in-out',
            mb: 1,
          }}
        >
          404
        </Typography>

        {/* Nội dung chữ xuất hiện mượt với fadeIn */}
        <Box
          sx={{
            animation: 'fadeIn 0.8s ease-out forwards',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Không tìm thấy trang
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.65)',
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '450px',
              mx: 'auto'
            }}
          >
            Đường dẫn này không tồn tại hoặc đã bị gỡ bỏ. Vui lòng bấm vào nút bên dưới để quay lại màn hình chính.
          </Typography>

          {/* Nút bấm dùng hiệu ứng transition css gốc */}
          <Button
            onClick={handleGoHome}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #a855f7)',
              color: '#fff',
              padding: '10px 32px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                transform: 'scale(1.03)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              }
            }}
          >
            Quay về Trang chủ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;