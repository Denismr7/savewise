using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class Category
    {
        public int? cId { get; set; }
        public string cName { get; set; }
        public int cUsrId { get; set; }

        public virtual User userNavigation { get; set; }
        public List<Transaction> transactions { get; set; }
    }

    public class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("categories");

            builder.HasKey(c => c.cId)
                   .HasName("PK_Categories");

            builder.Property(c => c.cId)
                   .HasColumnName("c_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(c => c.cName)
                   .HasColumnName("c_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(80)
                   .IsRequired();

            builder.Property(c => c.cUsrId)
                   .HasColumnName("c_user_id")
                   .HasColumnType("int");

            builder.HasOne(c => c.userNavigation)
                   .WithMany(u => u.categories)
                   .HasForeignKey(c => c.cUsrId);

        }
    }
}