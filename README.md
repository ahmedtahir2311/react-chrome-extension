# React Chrome Extension

This repository provides a boilerplate for building Chrome extensions using React. It offers a streamlined setup to help developers create and deploy Chrome extensions efficiently.

## Features

- **React Integration**: Seamlessly integrates React for building dynamic and responsive user interfaces.
- **Manifest V3 Support**: Utilizes Chrome's latest extension manifest version for enhanced performance and security.
- **Development Tools**: Includes tools for hot-reloading and debugging to streamline the development process.
- **Build Optimization**: Optimized build configurations for production-ready extensions.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ahmedtahir2311/react-chrome-extension.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd react-chrome-extension
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Development

To start the development server with hot-reloading:

```bash
npm start
```

This command will launch the extension in development mode, allowing you to test and debug your extension in real-time.

## Building for Production

To build the extension for production:

```bash
npm run build
```

The production-ready extension files will be generated in the `build/` directory.

## Loading the Extension into Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" at the top right.
3. Click on "Load unpacked" and select the `build/` directory.

Your extension should now be loaded and ready for testing.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.

For more detailed information and advanced configurations, please refer to the [official repository](https://github.com/ahmedtahir2311/react-chrome-extension/). 
