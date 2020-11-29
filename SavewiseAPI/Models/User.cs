using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class User
    {
        public int uId { get; set; }
        public string uLogin { get; set; }
        public string uName { get; set; }
        public string uLastName { get; set; }
        public string uPassword { get; set; }

        public virtual ICollection<Category> categories { get; set; }
    }

    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.Property(u => u.uId)
                   .HasColumnName("u_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(u => u.uName)
                   .HasColumnName("u_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(u => u.uLogin)
                   .HasColumnName("u_login")
                   .HasColumnType("varchar")
                   .HasMaxLength(15)
                   .IsRequired();

            builder.Property(u => u.uLastName)
                   .HasColumnName("u_lastname")
                   .HasColumnType("varchar")
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(u => u.uPassword)
                    .HasColumnName("u_password")
                    .HasColumnType("varchar")
                    .HasMaxLength(150)
                    .IsRequired();

            builder.HasKey(u => u.uId)
                   .HasName("PK_Users");
        }
    }
}