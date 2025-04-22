# Time and QR App

This is a simple web app that displays the current time and date with customizable options such as font color, size, and format. You can also generate a QR code based on a URL entered in the input field.

## Features:
- Displays the current time and date with custom styling (color, font size, and position).
- Allows users to update time and date formats.
- Customize the appearance of the time and date display (color, font size, drag position).
- Generates a QR code from a URL input by the user.

## Demo:
You can check out a live demo of this app [here](#) (Link to live demo if available).

## Installation:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/oksoft1/timeqr.git
    cd timeqr
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the app in development mode:

    ```bash
    npm start
    ```

    This will open the app in your browser at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.
See the section about [running tests](https://reactjs.org/docs/testing.html) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run eject`

**Note:** This is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc.) right into your project so you have full control over them. At this point, you're on your own.

You don’t have to ever use eject. The curated feature set is suitable for small and medium deployments, and you shouldn't feel obligated to use this feature.

## Configuration Options

### Customization Options:
- **Time Color**: Choose the color of the time display.
- **Date Color**: Choose the color of the date display.
- **Time Font Size**: Adjust the font size of the time.
- **Date Font Size**: Adjust the font size of the date.
- **Time Position**: Drag the time display to a custom position on the screen.
- **Date Position**: Drag the date display to a custom position on the screen.
- **Time Format**: Change the time format (e.g., `HH:mm:ss`, `hh:mm a`).
- **Date Format**: Change the date format (e.g., `yyyy-MM-dd`, `dddd, MMMM Do YYYY`).

### QR Code Generation:
- Enter a URL and click the **Generate QR Code** button to create a QR code for the URL.

## Contributing:
If you'd like to contribute to this project, feel free to fork the repository, make changes, and submit a pull request.

## License:
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments:
- React for providing an excellent framework to build this app.
- `react-qr-code` for generating QR codes.
- `date-fns` for date formatting.

## Android & iOS App
You can download the Clock Web App directly on your mobile device!

Download on Google Play (Android)
https://play.google.com/store/apps/details?id=com.f91w

Download on the App Store (iOS)
https://apps.apple.com/us/app/digital-date-widget/id6744653621

Moreover, the mobile apps offer a smooth experience with additional features, making it easy to keep track of time no matter where you are.

