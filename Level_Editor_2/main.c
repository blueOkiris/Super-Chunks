#include <gtk/gtk.h>

#define DEFAULT_SCREEN_WIDTH    800
#define DEFAULT_SCREEN_HEIGHT   600

static void activate(GtkApplication* app, gpointer user_data) {
    GtkWidget* window;

    window = gtk_application_window_new(app);
    gtk_window_set_title (GTK_WINDOW(window), "Super-Chunks Level Editor");
    gtk_window_set_default_size(GTK_WINDOW(window), DEFAULT_SCREEN_WIDTH, DEFAULT_SCREEN_HEIGHT);
    gtk_widget_show_all(window);
}

int main(int argc, char** argv) {
    GtkApplication* app;
    int status;

    app = gtk_application_new("io.github.blueokiris", G_APPLICATION_FLAGS_NONE);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);

    status = g_application_run(G_APPLICATION(app), argc, argv);

    g_object_unref(app);
    return status;
}