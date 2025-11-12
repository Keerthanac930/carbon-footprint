import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch


def add_box(ax, center, text, width=2.6, height=0.8, color="#2d6a4f"):
    x, y = center
    rect = FancyBboxPatch(
        (x - width / 2, y - height / 2),
        width,
        height,
        boxstyle="round,pad=0.1,rounding_size=0.08",
        linewidth=1.5,
        edgecolor=color,
        facecolor="#f0fdf4"
    )
    ax.add_patch(rect)
    ax.text(
        x,
        y,
        text,
        ha="center",
        va="center",
        fontsize=10,
        color="#1b4332",
        wrap=True
    )


def add_arrow(ax, start, end, color="#2d6a4f"):
    arrow = FancyArrowPatch(
        start,
        end,
        arrowstyle="-|>",
        mutation_scale=18,
        linewidth=1.2,
        color=color
    )
    ax.add_patch(arrow)


def main():
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis("off")

    nodes = {
        "client": ((5, 9.2), "User Interface\n(web / mobile)"),
        "api": ((5, 7.7), "FastAPI Service\nPOST /predict"),
        "validation": ((5, 6.2), "Schema Validation\n(Pydantic model)"),
        "preprocess": ((5, 4.6), "Preprocessing Pipeline\nMissing values, outliers, encoders"),
        "features": ((5, 3.2), "Feature Engineering\ninteraction / ratio / polynomial"),
        "scaling": ((5, 1.8), "Scaling & Feature Selection\nmatch training feature space"),
        "model": ((5, 0.6), "Regression Model\n(v3 carbon emission)"),
        "recommend": ((8.2, 2.4), "Recommendation Engine\nrule-based priorities"),
        "response": ((5, -0.6), "JSON Response\ncarbon footprint + actions"),
    }

    for key, (pos, label) in nodes.items():
        add_box(ax, pos, label)

    add_arrow(ax, (5, 8.8), (5, 8.1))
    add_arrow(ax, (5, 7.3), (5, 6.6))
    add_arrow(ax, (5, 5.8), (5, 5.0))
    add_arrow(ax, (5, 4.2), (5, 3.6))
    add_arrow(ax, (5, 2.8), (5, 2.2))
    add_arrow(ax, (5, 1.2), (5, 0.9))
    add_arrow(ax, (5, 0.3), (5, -0.2))

    add_arrow(ax, (5.9, 3.4), (7.8, 2.6))
    add_arrow(ax, (7.6, 2.1), (5.8, 1.2))

    ax.text(
        1.0,
        9.4,
        "Carbon Prediction Flow",
        fontsize=16,
        fontweight="bold",
        color="#1b4332",
        ha="left"
    )

    ax.text(
        1.0,
        8.7,
        "Model assets loaded from v3 bundle; preprocessing mirrors training pipeline",
        fontsize=10,
        color="#40916c",
        ha="left"
    )

    plt.tight_layout()
    output_path = "reports/carbon_prediction_flowchart.png"
    plt.savefig(output_path, dpi=200, bbox_inches="tight")
    print(f"Flowchart saved to {output_path}")


if __name__ == "__main__":
    main()
