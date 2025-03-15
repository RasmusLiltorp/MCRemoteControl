using System.IO;
using Avalonia.Controls;
using Avalonia.Interactivity;

namespace client;

public partial class MainWindow : Window
{
    private const string SettingsFile = "settings.cfg";

    public MainWindow()
    {
        InitializeComponent();
        LoadTheme();
    }

    private void LoadTheme()
    {
        if (File.Exists(SettingsFile))
        {
            string content = File.ReadAllText(SettingsFile);
            if (content.Trim() == "dark")
            {
                this.Styles.Add(App.DarkTheme);
            }
        }
    }

    private void OpenSettings_Click(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
    {
        new SettingsWindow().ShowDialog(this);
    }

    private void GenerateKeys_Click(object? sender, RoutedEventArgs e)
    {
        throw new System.NotImplementedException();
    }

    private void StartServer_Click(object? sender, RoutedEventArgs e)
    {
        throw new System.NotImplementedException();
    }

    private void StopServer_Click(object? sender, RoutedEventArgs e)
    {
        throw new System.NotImplementedException();
    }

    private void Connect_Click(object? sender, RoutedEventArgs e)
    {
        throw new System.NotImplementedException();
    }
}