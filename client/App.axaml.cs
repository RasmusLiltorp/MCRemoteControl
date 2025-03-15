using System;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Avalonia.Markup.Xaml.Styling;
using Avalonia.Styling;

namespace client;

public partial class App : Application
{
    public static Styles DarkTheme = new Styles
    {
        new StyleInclude(new Uri("avares://MCRemoteControl/Styles/Dark.axaml"))
        {
            Source = new Uri("avares://Avalonia.Themes.Fluent/FluentDark.axaml")
        }
    };
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            desktop.MainWindow = new MainWindow();
        }

        base.OnFrameworkInitializationCompleted();
    }
}