# Hướng dẫn cài đặt và triển khai dự án ReactJS với Firebase lên GitHub

## Bước 1: Chuẩn bị và cài đặt hệ điều hành

1. **Chuẩn bị máy tính:**

   - Đảm bảo máy tính có kết nối internet.
   - Chuẩn bị USB cài đặt hệ điều hành (Windows, macOS, hoặc Linux).

2. **Cài đặt hệ điều hành:**
   - **Windows:**
     - Tải công cụ tạo USB bootable từ trang web của Microsoft.
     - Tạo USB bootable và cài đặt Windows từ USB.
     - Làm theo hướng dẫn trên màn hình để hoàn tất cài đặt.
   - **macOS:**
     - Thực hiện cài đặt từ USB bootable (nếu cần).
     - Hoặc sử dụng chế độ Recovery để cài đặt lại macOS.
   - **Linux:**
     - Tải ISO của bản phân phối Linux (Ubuntu, Fedora, v.v.).
     - Tạo USB bootable và cài đặt Linux từ USB.
     - Làm theo hướng dẫn trên màn hình để hoàn tất cài đặt.

## Bước 2: Cài đặt các công cụ cần thiết

1. **Cài đặt Git:**

   - Tải Git từ [git-scm.com](https://git-scm.com/) và cài đặt theo hướng dẫn.
   - Kiểm tra cài đặt bằng cách mở terminal và chạy: `git --version`.

2. **Cài đặt Node.js và npm:**

   - Tải Node.js từ [nodejs.org](https://nodejs.org/) và cài đặt (nên chọn LTS version).
   - Kiểm tra cài đặt bằng cách mở terminal và chạy: `node --version` và `npm --version`.

3. **Cài đặt Visual Studio Code (VSCode):**
   - Tải Visual Studio Code từ [code.visualstudio.com](https://code.visualstudio.com/) và cài đặt.

## Bước 3: Khởi tạo dự án ReactJS

1. **Tạo dự án ReactJS:**

   - Mở terminal và chạy lệnh sau để tạo dự án ReactJS:
     ```bash
     npx create-react-app my-react-app
     cd my-react-app
     ```

2. **Khởi chạy dự án:**
   - Chạy lệnh sau để khởi chạy ứng dụng ReactJS:
     ```bash
     npm start
     ```
   - Mở trình duyệt và truy cập `http://localhost:3000` để xem ứng dụng ReactJS.

## Bước 4: Thiết lập Firebase

1. **Đăng ký Firebase:**

   - Truy cập [firebase.google.com](https://firebase.google.com/) và đăng ký tài khoản.
   - Tạo một dự án mới trên Firebase Console.

2. **Cài đặt Firebase SDK:**

   - Trong thư mục dự án ReactJS, chạy lệnh sau để cài đặt Firebase SDK:
     ```bash
     npm install firebase
     ```

3. **Cấu hình Firebase:**

   - Tạo file `src/firebase.js` và thêm mã sau (thay `config` bằng cấu hình Firebase của bạn):

     ```javascript
     // src/firebase.js
     import { initializeApp } from 'firebase/app';
     import { getFirestore } from 'firebase/firestore';
     import { getAuth } from 'firebase/auth';

     const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID',
     };

     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     const auth = getAuth(app);

     export { db, auth };
     ```

## Bước 5: Đẩy mã nguồn lên GitHub

1. **Tạo repository trên GitHub:**

   - Truy cập [github.com](https://github.com/) và tạo một repository mới.

2. **Đẩy mã nguồn lên GitHub:**
   - Mở terminal và thực hiện các lệnh sau:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/USERNAME/REPOSITORY.git
     git push -u origin main
     ```

## Bước 6: Triển khai ứng dụng trên GitHub Pages

1.  **Cài đặt gh-pages:**

    - Chạy lệnh sau trong thư mục dự án:
      ```bash
      npm install gh-pages --save-dev
      ```

2.  **Cấu hình deploy script trong `package.json`:**

        - Mở file `package.json` và thêm các dòng sau:

               ```json
          {

    "homepage": "https://USERNAME.github.io/REPOSITORY",
    "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    }
    }

3.  **Triển khai ứng dụng:**

    - Chạy lệnh sau để triển khai ứng dụng lên GitHub Pages:
      ```bash
      npm run deploy
      ```

4.  **Kiểm tra kết quả:**

    - Truy cập `https://USERNAME.github.io/REPOSITORY` để xem ứng dụng ReactJS của bạn đã được triển khai thành công.

## Tóm tắt:

1. Chuẩn bị và cài đặt hệ điều hành.
2. Cài đặt các công cụ cần thiết (Git, Node.js, VSCode).
3. Khởi tạo và chạy dự án ReactJS.
4. Thiết lập và cấu hình Firebase.
5. Đẩy mã nguồn lên GitHub.
6. Triển khai ứng dụng trên GitHub Pages.
