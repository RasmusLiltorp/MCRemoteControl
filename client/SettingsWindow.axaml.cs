using Avalonia.Controls;
using System.IO;
using client;

namespace client
{
    public partial class SettingsWindow : Window
    {
        private const string SettingsFile = "settings.cfg";

        public SettingsWindow()
        {
            InitializeComponent();
            LoadSettings();
        }

        private void LoadSettings()
        {
            if (File.Exists(SettingsFile))
            {
                string content = File.ReadAllText(SettingsFile);
                DarkModeToggle.IsChecked = content.Trim() == "dark";
            }
        }

        private void DarkModeToggle_Changed(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
        {
            string mode = DarkModeToggle.IsChecked == true ? "dark" : "light";
            File.WriteAllText(SettingsFile, mode);
            ApplyTheme();
        }

        private void ApplyTheme()
        {
            if (DarkModeToggle.IsChecked == true)
            {
                this.Styles.Add(App.DarkTheme);
            }
            else
            {
                this.Styles.Remove(App.DarkTheme);
            }
        }

        private void CloseSettings_Click(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
        {
            this.Close();
        }
    }
}